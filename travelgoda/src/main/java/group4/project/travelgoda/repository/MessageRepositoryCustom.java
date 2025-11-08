package group4.project.travelgoda.repository;

public interface MessageRepositoryCustom {
    
    void markMessagesAsRead(Long ticketId, Long userId);
    
    Long countUnreadMessagesByTicket(Long ticketId);
}
