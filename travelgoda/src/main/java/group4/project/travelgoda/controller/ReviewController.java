package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.request.CreateReviewRequest;
import group4.project.travelgoda.dto.response.ReviewResponse;
import group4.project.travelgoda.service.ReviewService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {
    
    private final ReviewService reviewService;
    
    @PostMapping
    public ResponseEntity<ReviewResponse> createReview(
            @RequestHeader(value = "X-Customer-ID", required = false) Long headerCustomerId,
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody CreateReviewRequest request) {
        
        Long customerId;
        if (headerCustomerId != null) {
            // For testing purposes
            customerId = headerCustomerId;
        } else if (userDetails != null) {
            // For production with real authentication
            customerId = Long.parseLong(userDetails.getUsername());
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        
        ReviewResponse response = reviewService.createNewReview(customerId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }
}