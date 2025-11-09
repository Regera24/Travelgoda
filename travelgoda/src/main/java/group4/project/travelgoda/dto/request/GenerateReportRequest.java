package group4.project.travelgoda.dto.request;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GenerateReportRequest {
    
    private String reportType; // DAILY, WEEKLY, MONTHLY, QUARTERLY, YEARLY, CUSTOM
    
    private LocalDateTime startDate;
    
    private LocalDateTime endDate;
    
    private String title;
    
    private String notes;
}
