package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Review;
import group4.project.travelgoda.repository.ReviewRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

@Repository
@Transactional
public class ReviewRepositoryImpl implements ReviewRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public BigDecimal calculateAverageRatingByTour(Long tourId) {
        String jpql = """
            SELECT COALESCE(AVG(CAST(r.rating AS decimal)), 0.0) FROM Review r 
            WHERE r.tourId = :tourId 
            AND r.parentReviewId IS NULL
        """;
        Double avgRating = entityManager.createQuery(jpql, Double.class)
                .setParameter("tourId", tourId)
                .getSingleResult();
        return BigDecimal.valueOf(avgRating);
    }
    
    @Override
    public List<Review> findTopReviewsByTour(Long tourId, int limit) {
        String jpql = """
            SELECT r FROM Review r 
            WHERE r.tourId = :tourId 
            AND r.parentReviewId IS NULL 
            ORDER BY r.rating DESC, r.createdAt DESC
        """;
        TypedQuery<Review> query = entityManager.createQuery(jpql, Review.class);
        query.setParameter("tourId", tourId);
        query.setMaxResults(limit);
        return query.getResultList();
    }
    
    @Override
    public Long countReviewsByTour(Long tourId) {
        String jpql = """
            SELECT COUNT(r) FROM Review r 
            WHERE r.tourId = :tourId 
            AND r.parentReviewId IS NULL
        """;
        return entityManager.createQuery(jpql, Long.class)
                .setParameter("tourId", tourId)
                .getSingleResult();
    }
}
