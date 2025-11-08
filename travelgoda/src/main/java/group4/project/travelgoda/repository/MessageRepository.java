package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Message;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MessageRepository extends JpaRepository<Message, Long>, MessageRepositoryCustom {
    
    List<Message> findByTicketIdOrderBySentAtAsc(Long ticketId);
    
    List<Message> findBySenderId(Long senderId);
    
    List<Message> findByTicketIdAndIsRead(Long ticketId, Boolean isRead);
}
