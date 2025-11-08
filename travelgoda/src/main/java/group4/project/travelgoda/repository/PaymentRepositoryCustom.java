package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Payment;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface PaymentRepositoryCustom {
    
    void updatePaymentStatus(Long paymentId, Payment.PaymentStatus status);
    
    BigDecimal calculateTotalRevenueByDateRange(LocalDateTime fromDate, LocalDateTime toDate);
    
    BigDecimal calculateProviderRevenue(Long providerId);
}
