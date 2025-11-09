package group4.project.travelgoda.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ReportResponse {
    
    private Long id;
    private String title;
    private String reportType;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private BigDecimal totalRevenue;
    private BigDecimal totalExpense;
    private BigDecimal netProfit;
    private Integer totalBookings;
    private Integer totalCustomers;
    private String generatedByUsername;
    private LocalDateTime createdAt;
    private String notes;
    
    // Detailed breakdown
    private List<TransactionData> transactions;
    private ReportSummary summary;
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class TransactionData {
        private Long bookingId;
        private String bookingReference;
        private LocalDateTime bookingDate;
        private String customerName;
        private String tourName;
        private Integer numberOfPeople;
        private BigDecimal amount;
        private String paymentStatus;
        private String bookingStatus;
    }
    
    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ReportSummary {
        private BigDecimal averageBookingValue;
        private Integer completedBookings;
        private Integer cancelledBookings;
        private Integer pendingBookings;
        private BigDecimal completionRate;
        private BigDecimal cancellationRate;
    }
}
