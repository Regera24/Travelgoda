package group4.project.travelgoda.dto.response;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Setter
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@JsonInclude(JsonInclude.Include.NON_NULL)
public class TourInfoResponse {
    Long tourId;
    String tourName;
    String description;
    String itinerary;
    String tourType;
    Integer durationDays;
    Integer groupSize;
    String status;
    BigDecimal averageRating;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    
    // Tour Provider info
    Long providerId;
    String providerName;
    
    // Category info
    Integer categoryId;
    String categoryName;
    
    // Schedule info (nếu có)
    List<ScheduleInfo> schedules;
    
    // Tour destinations
    List<String> destinations;
    
    @Setter
    @Getter
    @Builder
    @NoArgsConstructor
    @AllArgsConstructor
    @FieldDefaults(level = AccessLevel.PRIVATE)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    public static class ScheduleInfo {
        Long scheduleId;
        LocalDateTime startDate;
        LocalDateTime endDate;
        Integer availableSlots;
        Integer bookedSlots;
        Long guideId;
        String guideName;
    }
}
