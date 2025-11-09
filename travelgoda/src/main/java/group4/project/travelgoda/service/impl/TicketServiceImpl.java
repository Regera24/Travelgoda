package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.request.AssignTicketRequest;
import group4.project.travelgoda.dto.response.TicketDTO;
import group4.project.travelgoda.entity.Ticket;
import group4.project.travelgoda.repository.TicketRepository;
import group4.project.travelgoda.service.NotificationService;
import group4.project.travelgoda.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TicketServiceImpl implements TicketService {
    
    private final TicketRepository ticketRepository;
    private final NotificationService notificationService;
    
    @Override
    @Transactional(readOnly = true)
    public List<TicketDTO> getUnassignedTickets() {
        // Find all tickets with status OPEN (unassigned)
        List<Ticket> tickets = ticketRepository.findByStatus(Ticket.TicketStatus.OPEN);
        
        return tickets.stream()
            .map(this::mapToTicketDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional
    public TicketDTO assignTicket(AssignTicketRequest request) {
        // Find ticket by ID
        Ticket ticket = ticketRepository.findById(request.getTicketId())
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + request.getTicketId()));
        
        // Update assignment
        ticket.setAssignedTo(request.getAgentId());
        ticket.setStatus(Ticket.TicketStatus.IN_PROGRESS);
        
        // Save updated ticket
        Ticket updatedTicket = ticketRepository.save(ticket);
        
        // Notify customer that ticket has been assigned
        try {
            notificationService.notifyCustomer(
                ticket.getCustomerId(),
                "Ticket Assigned",
                "Your support ticket #" + ticket.getId() + " has been assigned to an agent and is being processed."
            );
        } catch (Exception e) {
            // Log error but don't fail the assignment
            System.err.println("Failed to send notification: " + e.getMessage());
        }
        
        return mapToTicketDTO(updatedTicket);
    }
    
    @Override
    @Transactional(readOnly = true)
    public List<TicketDTO> getTicketsByAgent(Long agentId) {
        // Find tickets where assignedTo = agentId and status is IN_PROGRESS or RESOLVED
        List<Ticket> tickets = ticketRepository.findAll().stream()
            .filter(ticket -> agentId.equals(ticket.getAssignedTo()))
            .collect(Collectors.toList());
        
        return tickets.stream()
            .map(this::mapToTicketDTO)
            .collect(Collectors.toList());
    }
    
    @Override
    @Transactional(readOnly = true)
    public TicketDTO getTicketById(Long ticketId) {
        Ticket ticket = ticketRepository.findById(ticketId)
            .orElseThrow(() -> new RuntimeException("Ticket not found with id: " + ticketId));
        
        return mapToTicketDTO(ticket);
    }
    
    private TicketDTO mapToTicketDTO(Ticket ticket) {
        String customerName = null;
        if (ticket.getCustomer() != null) {
            customerName = ticket.getCustomer().getFullName();
        }
        
        String assignedStaffName = null;
        if (ticket.getStaff() != null && ticket.getStaff().getUser() != null) {
            assignedStaffName = ticket.getStaff().getUser().getUsername();
        }
        
        return TicketDTO.builder()
            .id(ticket.getId())
            .customerId(ticket.getCustomerId())
            .customerName(customerName)
            .subject(ticket.getSubject())
            .priority(ticket.getPriority().name())
            .status(ticket.getStatus().name())
            .assignedTo(ticket.getAssignedTo())
            .assignedStaffName(assignedStaffName)
            .createdAt(ticket.getCreatedAt())
            .updatedAt(ticket.getUpdatedAt())
            .build();
    }
}
