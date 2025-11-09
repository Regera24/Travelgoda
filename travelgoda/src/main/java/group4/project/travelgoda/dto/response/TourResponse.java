package group4.project.travelgoda.dto.response;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.Set;

@Data
@AllArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
public class TourResponse {
    long id;
    String name;
    String image;
    double tourPrice;
    String description;
    Set<TourDestinationResponse> destination;
    int durationDays;
    int groupSize;
    CategoryResponse category;
    BigDecimal averageRating;
    String status;
    String itinerary;
}
