package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Ticket;

import java.util.List;

public interface TicketRepositoryCustom {
    
    void updateTicketStatus(Long ticketId, Ticket.TicketStatus status);
    
    List<Ticket> findOpenTicketsByPriority(Ticket.TicketPriority priority);
    
    Long countOpenTickets();
}
