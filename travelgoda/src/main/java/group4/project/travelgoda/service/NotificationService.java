package group4.project.travelgoda.service;

public interface NotificationService {
    
    /**
     * Send notification to a customer
     * @param customerId Customer ID
     * @param title Notification title
     * @param message Notification message
     */
    void notifyCustomer(Long customerId, String title, String message);
    
    /**
     * Send notification to a staff member
     * @param staffId Staff ID
     * @param title Notification title
     * @param message Notification message
     */
    void notifyStaff(Long staffId, String title, String message);
}
