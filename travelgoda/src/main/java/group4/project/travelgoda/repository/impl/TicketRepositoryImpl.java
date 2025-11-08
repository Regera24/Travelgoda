package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Ticket;
import group4.project.travelgoda.repository.TicketRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
@Transactional
public class TicketRepositoryImpl implements TicketRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void updateTicketStatus(Long ticketId, Ticket.TicketStatus status) {
        String jpql = "UPDATE Ticket t SET t.status = :status WHERE t.id = :ticketId";
        entityManager.createQuery(jpql)
                .setParameter("status", status)
                .setParameter("ticketId", ticketId)
                .executeUpdate();
    }
    
    @Override
    public List<Ticket> findOpenTicketsByPriority(Ticket.TicketPriority priority) {
        String jpql = """
            SELECT t FROM Ticket t 
            WHERE t.status IN (:statuses) 
            AND t.priority = :priority 
            ORDER BY t.createdAt ASC
        """;
        TypedQuery<Ticket> query = entityManager.createQuery(jpql, Ticket.class);
        query.setParameter("statuses", List.of(Ticket.TicketStatus.OPEN, Ticket.TicketStatus.IN_PROGRESS));
        query.setParameter("priority", priority);
        return query.getResultList();
    }
    
    @Override
    public Long countOpenTickets() {
        String jpql = """
            SELECT COUNT(t) FROM Ticket t 
            WHERE t.status IN (:statuses)
        """;
        return entityManager.createQuery(jpql, Long.class)
                .setParameter("statuses", List.of(Ticket.TicketStatus.OPEN, Ticket.TicketStatus.IN_PROGRESS))
                .getSingleResult();
    }
}
