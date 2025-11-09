package group4.project.travelgoda.dto.request;

import jakarta.validation.constraints.*;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class CreateReviewRequest {
    @NotNull(message = "Tour ID is required")
    private Long tourId;
    
    @NotNull(message = "Booking ID is required")
    private Long bookingId;
    
    private Long parentReviewId;
    
    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;
    
    @NotNull(message = "Comment is required")
    @Size(min = 10, message = "Comment must be at least 10 characters long")
    private String comment;
    
    private List<String> photos;
}