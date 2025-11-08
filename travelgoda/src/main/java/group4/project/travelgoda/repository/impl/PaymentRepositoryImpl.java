package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Payment;
import group4.project.travelgoda.repository.PaymentRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Repository
@Transactional
public class PaymentRepositoryImpl implements PaymentRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public void updatePaymentStatus(Long paymentId, Payment.PaymentStatus status) {
        String jpql = "UPDATE Payment p SET p.status = :status WHERE p.id = :paymentId";
        entityManager.createQuery(jpql)
                .setParameter("status", status)
                .setParameter("paymentId", paymentId)
                .executeUpdate();
    }
    
    @Override
    public BigDecimal calculateTotalRevenueByDateRange(LocalDateTime fromDate, LocalDateTime toDate) {
        String jpql = """
            SELECT COALESCE(SUM(p.amount), 0) FROM Payment p 
            WHERE p.status = :status 
            AND p.createdAt BETWEEN :fromDate AND :toDate
        """;
        return entityManager.createQuery(jpql, BigDecimal.class)
                .setParameter("status", Payment.PaymentStatus.COMPLETED)
                .setParameter("fromDate", fromDate)
                .setParameter("toDate", toDate)
                .getSingleResult();
    }
    
    @Override
    public BigDecimal calculateProviderRevenue(Long providerId) {
        String jpql = """
            SELECT COALESCE(SUM(p.amount), 0) FROM Payment p 
            JOIN Booking b ON p.bookingId = b.id 
            JOIN Schedule s ON b.scheduleId = s.id 
            JOIN Tour t ON s.tourId = t.id 
            WHERE t.providerId = :providerId 
            AND p.status = :status
        """;
        return entityManager.createQuery(jpql, BigDecimal.class)
                .setParameter("providerId", providerId)
                .setParameter("status", Payment.PaymentStatus.COMPLETED)
                .getSingleResult();
    }
}
