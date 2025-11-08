package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Pricing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PricingRepository extends JpaRepository<Pricing, Long> {
    
    List<Pricing> findByTourId(Long tourId);
    
    Optional<Pricing> findByTourIdAndCurrency(Long tourId, String currency);
}
