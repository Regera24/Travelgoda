package group4.project.travelgoda.dto.tourDTO;

import group4.project.travelgoda.entity.Tour;
import group4.project.travelgoda.entity.TourProvider;
import lombok.*;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TourDTO {
    private Long id;
    private Long tourProvider_Id;
    private Integer categoryId;
    private String name;
    private String description;
    private String tourType;
    private Integer durationDays;
    private Tour.TourStatus status;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Double tourPrice;
}
