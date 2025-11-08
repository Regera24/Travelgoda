package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.TourProvider;

import java.math.BigDecimal;
import java.util.List;

public interface TourProviderRepositoryCustom {
    
    void updateRating(Long providerId, BigDecimal newRating);
    
    List<TourProvider> findTopRatedProviders(int limit);
}
