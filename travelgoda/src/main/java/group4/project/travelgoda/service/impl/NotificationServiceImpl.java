package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.entity.Notification;
import group4.project.travelgoda.repository.NotificationRepository;
import group4.project.travelgoda.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {
    
    private final NotificationRepository notificationRepository;
    
    @Override
    @Transactional
    public void notifyCustomer(Long customerId, String title, String message) {
        Notification notification = Notification.builder()
            .userId(customerId)
            .message(message)
            .isRead(false)
            .build();
        
        notificationRepository.save(notification);
    }
    
    @Override
    @Transactional
    public void notifyStaff(Long staffId, String title, String message) {
        Notification notification = Notification.builder()
            .userId(staffId)
            .message(message)
            .isRead(false)
            .build();
        
        notificationRepository.save(notification);
    }
}
