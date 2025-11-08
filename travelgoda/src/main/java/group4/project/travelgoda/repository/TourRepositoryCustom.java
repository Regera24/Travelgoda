package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Tour;

import java.math.BigDecimal;
import java.util.List;

public interface TourRepositoryCustom {
    
    List<Tour> searchTours(String keyword, Integer categoryId, BigDecimal minRating);
    
    List<Tour> findPublishedToursByProvider(Long providerId);
    
    void updateAverageRating(Long tourId, BigDecimal newRating);
    
    List<Tour> findPopularTours(int limit);
}
