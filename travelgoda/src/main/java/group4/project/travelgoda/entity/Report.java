package group4.project.travelgoda.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "reports")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, length = 255)
    private String title;
    
    @Column(nullable = false, length = 50)
    @Enumerated(EnumType.STRING)
    private ReportType type;
    
    @Column(nullable = false)
    private LocalDateTime startDate;
    
    @Column(nullable = false)
    private LocalDateTime endDate;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalRevenue;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal totalExpense;
    
    @Column(precision = 15, scale = 2)
    private BigDecimal netProfit;
    
    @Column
    private Integer totalBookings;
    
    @Column
    private Integer totalCustomers;
    
    @Column(nullable = false)
    private Long generatedBy;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "generatedBy", insertable = false, updatable = false)
    private User user;
    
    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(columnDefinition = "nvarchar(max)")
    private String notes;
    
    public enum ReportType {
        DAILY,
        WEEKLY,
        MONTHLY,
        QUARTERLY,
        YEARLY,
        CUSTOM
    }
}
