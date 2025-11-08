package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Promotion;

import java.util.List;
import java.util.Optional;

public interface PromotionRepositoryCustom {
    
    Optional<Promotion> findValidPromotion(String promoCode);
    
    List<Promotion> findActivePromotions();
    
    void deactivatePromotion(Integer promotionId);
}
