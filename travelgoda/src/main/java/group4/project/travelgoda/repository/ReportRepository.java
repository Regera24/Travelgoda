package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public interface ReportRepository extends JpaRepository<Report, Long> {
    
    List<Report> findByGeneratedByOrderByCreatedAtDesc(Long userId);
    
    List<Report> findByTypeOrderByCreatedAtDesc(Report.ReportType type);
    
    @Query(value = """
        SELECT 
            b.id as bookingId,
            b.booking_reference as bookingReference,
            b.booking_date as bookingDate,
            b.number_of_people as numberOfPeople,
            b.total_amount as amount,
            b.status as bookingStatus,
            c.full_name as customerName,
            t.name as tourName,
            p.status as paymentStatus
        FROM bookings b
        LEFT JOIN customers c ON b.customer_id = c.user_id
        LEFT JOIN schedules s ON b.schedule_id = s.id
        LEFT JOIN tours t ON s.tour_id = t.id
        LEFT JOIN payments p ON b.id = p.booking_id
        WHERE b.booking_date BETWEEN :startDate AND :endDate
        ORDER BY b.booking_date DESC
    """, nativeQuery = true)
    List<Map<String, Object>> findTransactionalData(
        @Param("startDate") LocalDateTime startDate, 
        @Param("endDate") LocalDateTime endDate
    );
    
    @Query(value = """
        SELECT 
            COUNT(DISTINCT b.id) as totalBookings,
            COUNT(DISTINCT b.customer_id) as totalCustomers,
            COALESCE(SUM(CASE WHEN b.status = 'COMPLETED' THEN b.total_amount ELSE 0 END), 0) as totalRevenue,
            COUNT(CASE WHEN b.status = 'COMPLETED' THEN 1 END) as completedBookings,
            COUNT(CASE WHEN b.status = 'CANCELLED' THEN 1 END) as cancelledBookings,
            COUNT(CASE WHEN b.status = 'PENDING' THEN 1 END) as pendingBookings
        FROM bookings b
        WHERE b.booking_date BETWEEN :startDate AND :endDate
    """, nativeQuery = true)
    Map<String, Object> getReportSummary(
        @Param("startDate") LocalDateTime startDate,
        @Param("endDate") LocalDateTime endDate
    );
}
