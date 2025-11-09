package group4.project.travelgoda.dto.response;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
public class ReviewResponse {
    private Long id;
    private Long tourId;
    private Long customerId;
    private Long bookingId;
    private Long parentReviewId;
    private Integer rating;
    private String comment;
    private List<String> photos;
    private LocalDateTime createdAt;
}