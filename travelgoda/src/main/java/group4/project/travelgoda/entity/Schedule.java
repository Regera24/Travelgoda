package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "schedules")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Schedule {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long tourId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourId", insertable = false, updatable = false)
    private Tour tour;
    
    private Long guideId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "guideId", insertable = false, updatable = false)
    private TourGuide tourGuide;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(nullable = false)
    private Integer availableSlots;
    
    @Column(nullable = false)
    @Builder.Default
    private Integer bookedSlots = 0;
}
