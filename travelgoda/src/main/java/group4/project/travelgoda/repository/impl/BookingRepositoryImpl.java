package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Booking;
import group4.project.travelgoda.repository.BookingRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public class BookingRepositoryImpl implements BookingRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void updateBookingStatus(Long bookingId, Booking.BookingStatus status) {
        String jpql = "UPDATE Booking b SET b.status = :status WHERE b.id = :bookingId";
        entityManager.createQuery(jpql)
                .setParameter("status", status)
                .setParameter("bookingId", bookingId)
                .executeUpdate();
    }
    
    @Override
    public List<Booking> findUpcomingBookingsByCustomer(Long customerId) {
        String jpql = """
            SELECT b FROM Booking b 
            JOIN Schedule s ON b.scheduleId = s.id 
            WHERE b.customerId = :customerId 
            AND s.startDate >= :currentDate 
            AND b.status IN (:statuses)
            ORDER BY s.startDate ASC
        """;
        TypedQuery<Booking> query = entityManager.createQuery(jpql, Booking.class);
        query.setParameter("customerId", customerId);
        query.setParameter("currentDate", LocalDateTime.now());
        query.setParameter("statuses", List.of(Booking.BookingStatus.CONFIRMED, Booking.BookingStatus.PENDING));
        return query.getResultList();
    }
    
    @Override
    public List<Booking> findBookingsByDateRange(LocalDateTime fromDate, LocalDateTime toDate) {
        String jpql = """
            SELECT b FROM Booking b 
            WHERE b.bookingDate BETWEEN :fromDate AND :toDate
            ORDER BY b.bookingDate DESC
        """;
        TypedQuery<Booking> query = entityManager.createQuery(jpql, Booking.class);
        query.setParameter("fromDate", fromDate);
        query.setParameter("toDate", toDate);
        return query.getResultList();
    }
    
    @Override
    public Long countBookingsByTour(Long tourId) {
        String jpql = """
            SELECT COUNT(b) FROM Booking b 
            JOIN Schedule s ON b.scheduleId = s.id 
            WHERE s.tourId = :tourId
        """;
        return entityManager.createQuery(jpql, Long.class)
                .setParameter("tourId", tourId)
                .getSingleResult();
    }
}
