package group4.project.travelgoda.dto.tourDTO;

import group4.project.travelgoda.entity.Tour;
import lombok.*;
import org.springframework.stereotype.Component;

@Component
@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class TourStatusDTO {
    private Tour.TourStatus status;
}
