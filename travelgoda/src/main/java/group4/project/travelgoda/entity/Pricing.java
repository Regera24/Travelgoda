package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "pricings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Pricing {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long tourId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourId", insertable = false, updatable = false)
    private Tour tour;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal adultPrice;
    
    @Column(precision = 10, scale = 2)
    private BigDecimal childPrice;
    
    @Column(nullable = false, length = 10)
    @Builder.Default
    private String currency = "VND";
}
