package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.util.List;

@Entity
@Table(name = "tour_guides")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TourGuide {
    
    @Id
    private Long userId;
    
    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;
    
    @Column(nullable = false)
    private Long providerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "providerId", insertable = false, updatable = false)
    private TourProvider tourProvider;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "nvarchar(max)")
    private List<String> languages;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "nvarchar(max)")
    private List<String> certifications;
}
