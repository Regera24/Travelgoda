package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "promotions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Promotion {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    
    @Column(nullable = false, unique = true, length = 50)
    private String promoCode;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal discountValue;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private DiscountType discountType;
    
    @Column(nullable = false)
    private LocalDateTime validFrom;
    
    @Column(nullable = false)
    private LocalDateTime validTo;
    
    @Column(nullable = false)
    @Builder.Default
    private Boolean isActive = true;
    
    public enum DiscountType {
        PERCENTAGE,
        FIXED_AMOUNT
    }
}
