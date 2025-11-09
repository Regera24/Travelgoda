package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.request.CreateReviewRequest;
import group4.project.travelgoda.dto.response.ReviewResponse;

public interface ReviewService {
    
    ReviewResponse createNewReview(Long customerId, CreateReviewRequest request);
}