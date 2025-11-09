package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.request.GenerateReportRequest;
import group4.project.travelgoda.dto.response.ReportResponse;
import group4.project.travelgoda.entity.Report;
import group4.project.travelgoda.entity.User;
import group4.project.travelgoda.repository.ReportRepository;
import group4.project.travelgoda.repository.UserRepository;
import group4.project.travelgoda.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ReportServiceImpl implements ReportService {
    
    private final ReportRepository reportRepository;
    private final UserRepository userRepository;
    
    @Override
    @Transactional
    public ReportResponse generateReport(GenerateReportRequest request, Long userId) {
        // Validate user exists
        User user = userRepository.findById(userId)
            .orElseThrow(() -> new RuntimeException("User not found with id: " + userId));
        
        // Parse report type
        Report.ReportType reportType = Report.ReportType.valueOf(request.getReportType().toUpperCase());
        
        // Get transactional data from repository
        List<Map<String, Object>> transactionalData = reportRepository.findTransactionalData(
            request.getStartDate(),
            request.getEndDate()
        );
        
        // Get summary statistics
        Map<String, Object> summaryData = reportRepository.getReportSummary(
            request.getStartDate(),
            request.getEndDate()
        );
        
        // Calculate financial metrics
        BigDecimal totalRevenue = convertToBigDecimal(summaryData.get("totalRevenue"));
        Integer totalBookings = convertToInteger(summaryData.get("totalBookings"));
        Integer totalCustomers = convertToInteger(summaryData.get("totalCustomers"));
        Integer completedBookings = convertToInteger(summaryData.get("completedBookings"));
        Integer cancelledBookings = convertToInteger(summaryData.get("cancelledBookings"));
        Integer pendingBookings = convertToInteger(summaryData.get("pendingBookings"));
        
        // Calculate rates
        BigDecimal completionRate = calculateRate(completedBookings, totalBookings);
        BigDecimal cancellationRate = calculateRate(cancelledBookings, totalBookings);
        BigDecimal averageBookingValue = totalBookings > 0 
            ? totalRevenue.divide(BigDecimal.valueOf(totalBookings), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        
        // For now, we'll assume no expenses (can be enhanced later)
        BigDecimal totalExpense = BigDecimal.ZERO;
        BigDecimal netProfit = totalRevenue.subtract(totalExpense);
        
        // Build transaction list
        List<ReportResponse.TransactionData> transactions = transactionalData.stream()
            .map(this::mapToTransactionData)
            .collect(Collectors.toList());
        
        // Build summary
        ReportResponse.ReportSummary summary = ReportResponse.ReportSummary.builder()
            .averageBookingValue(averageBookingValue)
            .completedBookings(completedBookings)
            .cancelledBookings(cancelledBookings)
            .pendingBookings(pendingBookings)
            .completionRate(completionRate)
            .cancellationRate(cancellationRate)
            .build();
        
        // Save report to database
        Report report = Report.builder()
            .title(request.getTitle())
            .type(reportType)
            .startDate(request.getStartDate())
            .endDate(request.getEndDate())
            .totalRevenue(totalRevenue)
            .totalExpense(totalExpense)
            .netProfit(netProfit)
            .totalBookings(totalBookings)
            .totalCustomers(totalCustomers)
            .generatedBy(userId)
            .notes(request.getNotes())
            .build();
        
        Report savedReport = reportRepository.save(report);
        
        // Build response
        return ReportResponse.builder()
            .id(savedReport.getId())
            .title(savedReport.getTitle())
            .reportType(savedReport.getType().name())
            .startDate(savedReport.getStartDate())
            .endDate(savedReport.getEndDate())
            .totalRevenue(savedReport.getTotalRevenue())
            .totalExpense(savedReport.getTotalExpense())
            .netProfit(savedReport.getNetProfit())
            .totalBookings(savedReport.getTotalBookings())
            .totalCustomers(savedReport.getTotalCustomers())
            .generatedByUsername(user.getUsername())
            .createdAt(savedReport.getCreatedAt())
            .notes(savedReport.getNotes())
            .transactions(transactions)
            .summary(summary)
            .build();
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<ReportResponse> getReportsByUser(Long userId) {
        List<Report> reports = reportRepository.findByGeneratedByOrderByCreatedAtDesc(userId);
        
        return reports.stream()
            .map(this::mapToReportResponse)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public ReportResponse getReportById(Long reportId) {
        Report report = reportRepository.findById(reportId)
            .orElseThrow(() -> new RuntimeException("Report not found with id: " + reportId));
        
        // Get transactions for this report period
        List<Map<String, Object>> transactionalData = reportRepository.findTransactionalData(
            report.getStartDate(),
            report.getEndDate()
        );
        
        List<ReportResponse.TransactionData> transactions = transactionalData.stream()
            .map(this::mapToTransactionData)
            .collect(Collectors.toList());
        
        // Get summary
        Map<String, Object> summaryData = reportRepository.getReportSummary(
            report.getStartDate(),
            report.getEndDate()
        );
        
        Integer completedBookings = convertToInteger(summaryData.get("completedBookings"));
        Integer cancelledBookings = convertToInteger(summaryData.get("cancelledBookings"));
        Integer pendingBookings = convertToInteger(summaryData.get("pendingBookings"));
        
        BigDecimal completionRate = calculateRate(completedBookings, report.getTotalBookings());
        BigDecimal cancellationRate = calculateRate(cancelledBookings, report.getTotalBookings());
        BigDecimal averageBookingValue = report.getTotalBookings() > 0 
            ? report.getTotalRevenue().divide(BigDecimal.valueOf(report.getTotalBookings()), 2, RoundingMode.HALF_UP)
            : BigDecimal.ZERO;
        
        ReportResponse.ReportSummary summary = ReportResponse.ReportSummary.builder()
            .averageBookingValue(averageBookingValue)
            .completedBookings(completedBookings)
            .cancelledBookings(cancelledBookings)
            .pendingBookings(pendingBookings)
            .completionRate(completionRate)
            .cancellationRate(cancellationRate)
            .build();
        
        ReportResponse response = mapToReportResponse(report);
        response.setTransactions(transactions);
        response.setSummary(summary);
        
        return response;
    }
    
    private ReportResponse mapToReportResponse(Report report) {
        String username = report.getUser() != null ? report.getUser().getUsername() : "Unknown";
        
        return ReportResponse.builder()
            .id(report.getId())
            .title(report.getTitle())
            .reportType(report.getType().name())
            .startDate(report.getStartDate())
            .endDate(report.getEndDate())
            .totalRevenue(report.getTotalRevenue())
            .totalExpense(report.getTotalExpense())
            .netProfit(report.getNetProfit())
            .totalBookings(report.getTotalBookings())
            .totalCustomers(report.getTotalCustomers())
            .generatedByUsername(username)
            .createdAt(report.getCreatedAt())
            .notes(report.getNotes())
            .build();
    }
    
    private ReportResponse.TransactionData mapToTransactionData(Map<String, Object> data) {
        return ReportResponse.TransactionData.builder()
            .bookingId(convertToLong(data.get("bookingId")))
            .bookingReference((String) data.get("bookingReference"))
            .bookingDate(convertToLocalDateTime(data.get("bookingDate")))
            .customerName((String) data.get("customerName"))
            .tourName((String) data.get("tourName"))
            .numberOfPeople(convertToInteger(data.get("numberOfPeople")))
            .amount(convertToBigDecimal(data.get("amount")))
            .paymentStatus((String) data.get("paymentStatus"))
            .bookingStatus((String) data.get("bookingStatus"))
            .build();
    }
    
    private BigDecimal calculateRate(Integer count, Integer total) {
        if (total == null || total == 0) {
            return BigDecimal.ZERO;
        }
        return BigDecimal.valueOf(count)
            .divide(BigDecimal.valueOf(total), 4, RoundingMode.HALF_UP)
            .multiply(BigDecimal.valueOf(100));
    }
    
    private BigDecimal convertToBigDecimal(Object value) {
        if (value == null) return BigDecimal.ZERO;
        if (value instanceof BigDecimal) return (BigDecimal) value;
        if (value instanceof Number) return BigDecimal.valueOf(((Number) value).doubleValue());
        return BigDecimal.ZERO;
    }
    
    private Integer convertToInteger(Object value) {
        if (value == null) return 0;
        if (value instanceof Integer) return (Integer) value;
        if (value instanceof Number) return ((Number) value).intValue();
        return 0;
    }
    
    private Long convertToLong(Object value) {
        if (value == null) return null;
        if (value instanceof Long) return (Long) value;
        if (value instanceof Number) return ((Number) value).longValue();
        return null;
    }
    
    private LocalDateTime convertToLocalDateTime(Object value) {
        if (value == null) return null;
        if (value instanceof LocalDateTime) return (LocalDateTime) value;
        if (value instanceof java.sql.Timestamp) {
            return ((java.sql.Timestamp) value).toLocalDateTime();
        }
        return null;
    }
}
