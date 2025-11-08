package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.repository.NotificationRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Repository
@Transactional
public class NotificationRepositoryImpl implements NotificationRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void markAsRead(Long notificationId) {
        String jpql = "UPDATE Notification n SET n.isRead = true WHERE n.id = :notificationId";
        entityManager.createQuery(jpql)
                .setParameter("notificationId", notificationId)
                .executeUpdate();
    }
    
    @Override
    public void markAllAsReadByUser(Long userId) {
        String jpql = "UPDATE Notification n SET n.isRead = true WHERE n.userId = :userId";
        entityManager.createQuery(jpql)
                .setParameter("userId", userId)
                .executeUpdate();
    }
    
    @Override
    public Long countUnreadByUser(Long userId) {
        String jpql = "SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.isRead = false";
        return entityManager.createQuery(jpql, Long.class)
                .setParameter("userId", userId)
                .getSingleResult();
    }
    
    @Override
    public void deleteOldNotifications(int daysOld) {
        String jpql = "DELETE FROM Notification n WHERE n.createdAt < :cutoffDate";
        LocalDateTime cutoffDate = LocalDateTime.now().minusDays(daysOld);
        entityManager.createQuery(jpql)
                .setParameter("cutoffDate", cutoffDate)
                .executeUpdate();
    }
}
