package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Tour;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface TourRepository extends JpaRepository<Tour, Long>, TourRepositoryCustom {
    
    List<Tour> findByProviderId(Long providerId);
    
    List<Tour> findByCategoryId(Integer categoryId);
    
    List<Tour> findByStatus(Tour.TourStatus status);
    
    List<Tour> findByAverageRatingGreaterThanEqual(BigDecimal rating);
    
    List<Tour> findByNameContainingIgnoreCase(String name);
}
