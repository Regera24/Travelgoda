package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "staff")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Staff {
    
    @Id
    private Long userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false, length = 255)
    private String department;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private StaffRole staffRole;
    
    public enum StaffRole {
        ADMIN,
        SUPPORT,
        FINANCE,
        MARKETING
    }
}
