package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.request.AssignTicketRequest;
import group4.project.travelgoda.dto.response.TicketDTO;

import java.util.List;

public interface TicketService {
    
    /**
     * Get all unassigned tickets (status = OPEN)
     * @return List of unassigned tickets
     */
    List<TicketDTO> getUnassignedTickets();
    
    /**
     * Assign a ticket to a support agent
     * @param request Assignment request with ticketId and agentId
     * @return Updated ticket DTO
     */
    TicketDTO assignTicket(AssignTicketRequest request);
    
    /**
     * Get tickets assigned to a specific agent
     * @param agentId Agent/Staff ID
     * @return List of assigned tickets
     */
    List<TicketDTO> getTicketsByAgent(Long agentId);
    
    /**
     * Get ticket by ID
     * @param ticketId Ticket ID
     * @return Ticket DTO
     */
    TicketDTO getTicketById(Long ticketId);
}
