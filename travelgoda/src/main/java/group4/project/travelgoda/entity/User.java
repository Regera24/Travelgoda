package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 255)
    private String username;
    
    @Column(nullable = false, unique = true, length = 255)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String password;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private UserRole role;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private UserStatus status = UserStatus.ACTIVE;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    public enum UserRole {
        CUSTOMER,
        TOUR_PROVIDER,
        TOUR_GUIDE,
        STAFF,
        ADMIN
    }
    
    public enum UserStatus {
        ACTIVE,
        SUSPENDED,
        DELETED
    }
}
