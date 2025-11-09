package group4.project.travelgoda.dto.resquest;

import lombok.AccessLevel;
import lombok.Data;
import lombok.experimental.FieldDefaults;

@Data
@FieldDefaults(level = AccessLevel.PRIVATE)
public class TourRequest {
    String name;
    double tourPrice;
    String description;
    int durationDays;
    int categoryId;
    int groupSize;
}
