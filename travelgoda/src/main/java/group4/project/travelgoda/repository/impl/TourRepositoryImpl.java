package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Tour;
import group4.project.travelgoda.repository.TourRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@Transactional
public class TourRepositoryImpl implements TourRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Tour> searchTours(String keyword, Integer categoryId, BigDecimal minRating) {
        StringBuilder jpql = new StringBuilder("SELECT t FROM Tour t WHERE t.status = :status");
        
        if (keyword != null && !keyword.isEmpty()) {
            jpql.append(" AND (LOWER(t.name) LIKE LOWER(:keyword) OR LOWER(t.description) LIKE LOWER(:keyword))");
        }
        if (categoryId != null) {
            jpql.append(" AND t.categoryId = :categoryId");
        }
        if (minRating != null) {
            jpql.append(" AND t.averageRating >= :minRating");
        }
        
        TypedQuery<Tour> query = entityManager.createQuery(jpql.toString(), Tour.class);
        query.setParameter("status", Tour.TourStatus.PUBLISHED);
        
        if (keyword != null && !keyword.isEmpty()) {
            query.setParameter("keyword", "%" + keyword + "%");
        }
        if (categoryId != null) {
            query.setParameter("categoryId", categoryId);
        }
        if (minRating != null) {
            query.setParameter("minRating", minRating);
        }
        
        return query.getResultList();
    }
    
    @Override
    public List<Tour> findPublishedToursByProvider(Long providerId) {
        String jpql = "SELECT t FROM Tour t WHERE t.providerId = :providerId AND t.status = :status";
        TypedQuery<Tour> query = entityManager.createQuery(jpql, Tour.class);
        query.setParameter("providerId", providerId);
        query.setParameter("status", Tour.TourStatus.PUBLISHED);
        return query.getResultList();
    }
    
    @Override
    public void updateAverageRating(Long tourId, BigDecimal newRating) {
        String jpql = "UPDATE Tour t SET t.averageRating = :rating WHERE t.id = :tourId";
        entityManager.createQuery(jpql)
                .setParameter("rating", newRating)
                .setParameter("tourId", tourId)
                .executeUpdate();
    }
    
    @Override
    public List<Tour> findPopularTours(int limit) {
        String jpql = """
            SELECT t FROM Tour t 
            WHERE t.status = :status 
            ORDER BY t.averageRating DESC, t.createdAt DESC
        """;
        TypedQuery<Tour> query = entityManager.createQuery(jpql, Tour.class);
        query.setParameter("status", Tour.TourStatus.PUBLISHED);
        query.setMaxResults(limit);
        return query.getResultList();
    }
}
