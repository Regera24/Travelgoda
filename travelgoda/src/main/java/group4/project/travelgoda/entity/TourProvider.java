package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "tour_providers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourProvider {
    
    @Id
    private Long userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, length = 255)
    private String companyName;
    
    @Column(length = 255)
    private String businessLicense;
    
    @Column(nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal rating = BigDecimal.ZERO;
}
