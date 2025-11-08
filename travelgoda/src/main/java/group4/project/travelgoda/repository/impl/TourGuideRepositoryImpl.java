package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.TourGuide;
import group4.project.travelgoda.repository.TourGuideRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class TourGuideRepositoryImpl implements TourGuideRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<TourGuide> findGuidesByLanguage(String language) {
        String jpql = "SELECT tg FROM TourGuide tg WHERE JSON_VALUE(tg.languages, '$[*]') LIKE :language";
        TypedQuery<TourGuide> query = entityManager.createQuery(jpql, TourGuide.class);
        query.setParameter("language", "%" + language + "%");
        return query.getResultList();
    }
    
    @Override
    public List<TourGuide> findAvailableGuidesForSchedule(Long scheduleId) {
        String jpql = """
            SELECT tg FROM TourGuide tg 
            WHERE tg.userId NOT IN (
                SELECT s.guideId FROM Schedule s 
                WHERE s.id = :scheduleId AND s.guideId IS NOT NULL
            )
        """;
        TypedQuery<TourGuide> query = entityManager.createQuery(jpql, TourGuide.class);
        query.setParameter("scheduleId", scheduleId);
        return query.getResultList();
    }
}
