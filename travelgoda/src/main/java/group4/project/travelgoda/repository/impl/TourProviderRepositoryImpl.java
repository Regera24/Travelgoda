package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.TourProvider;
import group4.project.travelgoda.repository.TourProviderRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@Transactional
public class TourProviderRepositoryImpl implements TourProviderRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void updateRating(Long providerId, BigDecimal newRating) {
        String jpql = "UPDATE TourProvider tp SET tp.rating = :rating WHERE tp.userId = :providerId";
        entityManager.createQuery(jpql)
                .setParameter("rating", newRating)
                .setParameter("providerId", providerId)
                .executeUpdate();
    }
    
    @Override
    public List<TourProvider> findTopRatedProviders(int limit) {
        String jpql = "SELECT tp FROM TourProvider tp ORDER BY tp.rating DESC";
        TypedQuery<TourProvider> query = entityManager.createQuery(jpql, TourProvider.class);
        query.setMaxResults(limit);
        return query.getResultList();
    }
}
