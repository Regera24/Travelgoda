package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Ticket;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TicketRepository extends JpaRepository<Ticket, Long>, TicketRepositoryCustom {
    
    List<Ticket> findByCustomerId(Long customerId);
    
    List<Ticket> findByStatus(Ticket.TicketStatus status);
    
    List<Ticket> findByPriority(Ticket.TicketPriority priority);
    
    List<Ticket> findByCustomerIdAndStatus(Long customerId, Ticket.TicketStatus status);
}
