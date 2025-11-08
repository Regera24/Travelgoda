package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.repository.MessageRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
@Transactional
public class MessageRepositoryImpl implements MessageRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void markMessagesAsRead(Long ticketId, Long userId) {
        String jpql = """
            UPDATE Message m SET m.isRead = true 
            WHERE m.ticketId = :ticketId 
            AND m.senderId != :userId
        """;
        entityManager.createQuery(jpql)
                .setParameter("ticketId", ticketId)
                .setParameter("userId", userId)
                .executeUpdate();
    }
    
    @Override
    public Long countUnreadMessagesByTicket(Long ticketId) {
        String jpql = """
            SELECT COUNT(m) FROM Message m 
            WHERE m.ticketId = :ticketId 
            AND m.isRead = false
        """;
        return entityManager.createQuery(jpql, Long.class)
                .setParameter("ticketId", ticketId)
                .getSingleResult();
    }
}
