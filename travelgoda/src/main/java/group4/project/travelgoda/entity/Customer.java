package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "customers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Customer {
    
    @Id
    private Long userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, length = 255)
    private String fullName;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer loyaltyPoints = 0;
}
