package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Promotion;
import group4.project.travelgoda.repository.PromotionRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.NoResultException;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
@Transactional
public class PromotionRepositoryImpl implements PromotionRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public Optional<Promotion> findValidPromotion(String promoCode) {
        String jpql = """
            SELECT p FROM Promotion p 
            WHERE p.promoCode = :promoCode 
            AND p.isActive = true 
            AND p.validFrom <= :now 
            AND p.validTo >= :now
        """;
        try {
            LocalDateTime now = LocalDateTime.now();
            Promotion promotion = entityManager.createQuery(jpql, Promotion.class)
                    .setParameter("promoCode", promoCode)
                    .setParameter("now", now)
                    .getSingleResult();
            return Optional.of(promotion);
        } catch (NoResultException e) {
            return Optional.empty();
        }
    }
    
    @Override
    public List<Promotion> findActivePromotions() {
        String jpql = """
            SELECT p FROM Promotion p 
            WHERE p.isActive = true 
            AND p.validFrom <= :now 
            AND p.validTo >= :now
            ORDER BY p.validTo ASC
        """;
        LocalDateTime now = LocalDateTime.now();
        TypedQuery<Promotion> query = entityManager.createQuery(jpql, Promotion.class);
        query.setParameter("now", now);
        return query.getResultList();
    }
    
    @Override
    public void deactivatePromotion(Integer promotionId) {
        String jpql = "UPDATE Promotion p SET p.isActive = false WHERE p.id = :promotionId";
        entityManager.createQuery(jpql)
                .setParameter("promotionId", promotionId)
                .executeUpdate();
    }
}
