package group4.project.travelgoda.repository;

import java.util.List;

public interface NotificationRepositoryCustom {
    
    void markAsRead(Long notificationId);
    
    void markAllAsReadByUser(Long userId);
    
    Long countUnreadByUser(Long userId);
    
    void deleteOldNotifications(int daysOld);
}
