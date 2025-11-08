package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Review;

import java.math.BigDecimal;
import java.util.List;

public interface ReviewRepositoryCustom {
    
    BigDecimal calculateAverageRatingByTour(Long tourId);
    
    List<Review> findTopReviewsByTour(Long tourId, int limit);
    
    Long countReviewsByTour(Long tourId);
}
