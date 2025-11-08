package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long>, BookingRepositoryCustom {
    
    Optional<Booking> findByBookingReference(String bookingReference);
    
    List<Booking> findByCustomerId(Long customerId);
    
    List<Booking> findByScheduleId(Long scheduleId);
    
    List<Booking> findByStatus(Booking.BookingStatus status);
    
    List<Booking> findByCustomerIdAndStatus(Long customerId, Booking.BookingStatus status);
}
