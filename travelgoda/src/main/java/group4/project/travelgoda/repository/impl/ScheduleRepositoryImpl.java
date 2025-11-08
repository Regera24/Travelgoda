package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Schedule;
import group4.project.travelgoda.repository.ScheduleRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public class ScheduleRepositoryImpl implements ScheduleRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Schedule> findAvailableSchedules(Long tourId, LocalDateTime fromDate) {
        String jpql = """
            SELECT s FROM Schedule s 
            WHERE s.tourId = :tourId 
            AND s.startDate >= :fromDate 
            AND s.availableSlots > s.bookedSlots
            ORDER BY s.startDate ASC
        """;
        TypedQuery<Schedule> query = entityManager.createQuery(jpql, Schedule.class);
        query.setParameter("tourId", tourId);
        query.setParameter("fromDate", fromDate);
        return query.getResultList();
    }
    
    @Override
    public void updateBookedSlots(Long scheduleId, Integer slots) {
        String jpql = "UPDATE Schedule s SET s.bookedSlots = s.bookedSlots + :slots WHERE s.id = :scheduleId";
        entityManager.createQuery(jpql)
                .setParameter("slots", slots)
                .setParameter("scheduleId", scheduleId)
                .executeUpdate();
    }
    
    @Override
    public List<Schedule> findUpcomingSchedulesByGuide(Long guideId) {
        String jpql = """
            SELECT s FROM Schedule s 
            WHERE s.guideId = :guideId 
            AND s.startDate >= :currentDate
            ORDER BY s.startDate ASC
        """;
        TypedQuery<Schedule> query = entityManager.createQuery(jpql, Schedule.class);
        query.setParameter("guideId", guideId);
        query.setParameter("currentDate", LocalDateTime.now());
        return query.getResultList();
    }
}
