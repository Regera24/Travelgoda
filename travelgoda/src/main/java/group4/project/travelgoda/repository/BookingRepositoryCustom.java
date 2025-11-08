package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Booking;

import java.time.LocalDateTime;
import java.util.List;

public interface BookingRepositoryCustom {
    
    void updateBookingStatus(Long bookingId, Booking.BookingStatus status);
    
    List<Booking> findUpcomingBookingsByCustomer(Long customerId);
    
    List<Booking> findBookingsByDateRange(LocalDateTime fromDate, LocalDateTime toDate);
    
    Long countBookingsByTour(Long tourId);
}
