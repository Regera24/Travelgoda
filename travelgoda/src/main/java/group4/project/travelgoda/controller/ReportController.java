package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.request.GenerateReportRequest;
import group4.project.travelgoda.dto.response.ApiResponse;
import group4.project.travelgoda.dto.response.ReportResponse;
import group4.project.travelgoda.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/reports")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class ReportController {
    
    private final ReportService reportService;
    
    /**
     * Generate a new financial report
     * POST /reports/generate
     */
    @PostMapping("/generate")
    public ResponseEntity<ApiResponse<ReportResponse>> generateReportRequest(@RequestBody GenerateReportRequest request) {
        try {
            // In a real application, userId would come from authenticated user session/JWT
            // For now, using a default userId (Financial Manager ID)
            Long userId = 1L; // This should be extracted from security context
            
            ReportResponse report = reportService.generateReport(request, userId);
            
            return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Report generated successfully")
                .data(report)
                .build());
                
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.<ReportResponse>builder()
                .code(HttpStatus.BAD_REQUEST.value())
                .message("Invalid request: " + e.getMessage())
                .data(null)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<ReportResponse>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to generate report: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
    
    /**
     * Get all reports for a specific user
     * GET /reports/user/{userId}
     */
    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<ReportResponse>>> getReportsByUser(@PathVariable Long userId) {
        try {
            List<ReportResponse> reports = reportService.getReportsByUser(userId);
            
            return ResponseEntity.ok(ApiResponse.<List<ReportResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Reports retrieved successfully")
                .data(reports)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<List<ReportResponse>>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to retrieve reports: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
    
    /**
     * Get a specific report by ID
     * GET /reports/{reportId}
     */
    @GetMapping("/{reportId}")
    public ResponseEntity<ApiResponse<ReportResponse>> getReportById(@PathVariable Long reportId) {
        try {
            ReportResponse report = reportService.getReportById(reportId);
            
            return ResponseEntity.ok(ApiResponse.<ReportResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Report retrieved successfully")
                .data(report)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<ReportResponse>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("Report not found: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
}
