package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.TourProvider;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@Repository
public interface TourProviderRepository extends JpaRepository<TourProvider, Long>, TourProviderRepositoryCustom {
    
    Optional<TourProvider> findByUserEmail(String email);
    
    List<TourProvider> findByRatingGreaterThanEqual(BigDecimal rating);
}
