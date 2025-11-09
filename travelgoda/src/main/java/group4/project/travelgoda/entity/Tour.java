package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "tours")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tour {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long providerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "providerId", insertable = false, updatable = false)
    private TourProvider tourProvider;
    
    @Column(nullable = false)
    private Integer categoryId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "categoryId", insertable = false, updatable = false)
    private Category category;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, columnDefinition = "nvarchar(max)")
    private String description;

    @Column(columnDefinition = "nvarchar(max)")
    private String image;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String itinerary;
    
    @Column(length = 100)
    private String tourType;

    @Column(nullable = false)
    private double tourPrice;
    
    @Column(nullable = false)
    private Integer durationDays;
    
    @Column(nullable = false)
    private Integer groupSize;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    @Builder.Default
    private TourStatus status = TourStatus.DRAFT;
    
    @Column(nullable = false, precision = 3, scale = 2)
    @Builder.Default
    private BigDecimal averageRating = BigDecimal.ZERO;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @UpdateTimestamp
    @Column(nullable = false)
    private LocalDateTime updatedAt;
    
    @OneToMany(mappedBy = "tour", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private Set<TourDestination> tourDestinations = new HashSet<>();
    
    public enum TourStatus {
        DRAFT,
        PUBLISHED,
        UNPUBLISHED
    }
}
