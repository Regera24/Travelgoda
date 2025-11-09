package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.request.AssignTicketRequest;
import group4.project.travelgoda.dto.response.ApiResponse;
import group4.project.travelgoda.dto.response.TicketDTO;
import group4.project.travelgoda.service.TicketService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tickets")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class TicketController {
    
    private final TicketService ticketService;
    
    /**
     * Get all unassigned tickets (status = OPEN)
     * GET /tickets/unassigned
     */
    @GetMapping("/unassigned")
    public ResponseEntity<ApiResponse<List<TicketDTO>>> getUnassignedTickets() {
        try {
            List<TicketDTO> tickets = ticketService.getUnassignedTickets();
            
            return ResponseEntity.ok(ApiResponse.<List<TicketDTO>>builder()
                .code(HttpStatus.OK.value())
                .message("Unassigned tickets retrieved successfully")
                .data(tickets)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<List<TicketDTO>>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to retrieve tickets: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
    
    /**
     * Assign a ticket to an agent
     * PUT /tickets/assign
     */
    @PutMapping("/assign")
    public ResponseEntity<ApiResponse<TicketDTO>> assignTicket(@RequestBody AssignTicketRequest request) {
        try {
            TicketDTO ticket = ticketService.assignTicket(request);
            
            return ResponseEntity.ok(ApiResponse.<TicketDTO>builder()
                .code(HttpStatus.OK.value())
                .message("Ticket assigned successfully")
                .data(ticket)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.<TicketDTO>builder()
                    .code(HttpStatus.BAD_REQUEST.value())
                    .message("Failed to assign ticket: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
    
    /**
     * Get tickets assigned to a specific agent
     * GET /tickets/agent/{agentId}
     */
    @GetMapping("/agent/{agentId}")
    public ResponseEntity<ApiResponse<List<TicketDTO>>> getTicketsByAgent(@PathVariable Long agentId) {
        try {
            List<TicketDTO> tickets = ticketService.getTicketsByAgent(agentId);
            
            return ResponseEntity.ok(ApiResponse.<List<TicketDTO>>builder()
                .code(HttpStatus.OK.value())
                .message("Agent tickets retrieved successfully")
                .data(tickets)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.<List<TicketDTO>>builder()
                    .code(HttpStatus.INTERNAL_SERVER_ERROR.value())
                    .message("Failed to retrieve tickets: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
    
    /**
     * Get a specific ticket by ID
     * GET /tickets/{ticketId}
     */
    @GetMapping("/{ticketId}")
    public ResponseEntity<ApiResponse<TicketDTO>> getTicketById(@PathVariable Long ticketId) {
        try {
            TicketDTO ticket = ticketService.getTicketById(ticketId);
            
            return ResponseEntity.ok(ApiResponse.<TicketDTO>builder()
                .code(HttpStatus.OK.value())
                .message("Ticket retrieved successfully")
                .data(ticket)
                .build());
                
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.<TicketDTO>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("Ticket not found: " + e.getMessage())
                    .data(null)
                    .build());
        }
    }
}
