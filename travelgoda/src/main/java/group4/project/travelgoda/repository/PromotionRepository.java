package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer>, PromotionRepositoryCustom {
    
    Optional<Promotion> findByPromoCode(String promoCode);
    
    List<Promotion> findByIsActive(Boolean isActive);
    
    List<Promotion> findByValidFromBeforeAndValidToAfter(LocalDateTime now1, LocalDateTime now2);
}
