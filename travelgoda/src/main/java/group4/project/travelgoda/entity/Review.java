package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "reviews")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private Long tourId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "tourId", insertable = false, updatable = false)
    private Tour tour;
    
    @Column(nullable = false)
    private Long customerId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "customerId", insertable = false, updatable = false)
    private Customer customer;
    
    @Column(nullable = false)
    private Long bookingId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bookingId", insertable = false, updatable = false)
    private Booking booking;
    
    private Long parentReviewId;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parentReviewId", insertable = false, updatable = false)
    private Review parentReview;
    
    @Column(nullable = false)
    private Integer rating;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String comment;
    
    @JdbcTypeCode(SqlTypes.JSON)
    @Column(columnDefinition = "nvarchar(max)")
    private List<String> photos;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
