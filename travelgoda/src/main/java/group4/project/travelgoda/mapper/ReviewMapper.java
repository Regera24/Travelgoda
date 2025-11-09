package group4.project.travelgoda.mapper;

import group4.project.travelgoda.dto.response.ReviewResponse;
import group4.project.travelgoda.entity.Review;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.stream.Collectors;

@Component
@RequiredArgsConstructor
public class ReviewMapper {
    
    private final ModelMapper modelMapper;
    
    public ReviewResponse toResponse(Review review) {
        return modelMapper.map(review, ReviewResponse.class);
    }
    
    public List<ReviewResponse> toResponseList(List<Review> reviews) {
        return reviews.stream()
                .map(this::toResponse)
                .collect(Collectors.toList());
    }
    
    public Review toEntity(ReviewResponse reviewResponse) {
        return modelMapper.map(reviewResponse, Review.class);
    }
}