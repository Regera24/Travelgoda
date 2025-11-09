package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.request.CreateReviewRequest;
import group4.project.travelgoda.entity.Review;
import group4.project.travelgoda.dto.response.ReviewResponse;
import group4.project.travelgoda.entity.Booking;
import group4.project.travelgoda.exception.AppException;
import group4.project.travelgoda.exception.ErrorCode;
import group4.project.travelgoda.repository.BookingRepository;
import group4.project.travelgoda.repository.ReviewRepository;
import group4.project.travelgoda.service.ReviewService;
import group4.project.travelgoda.mapper.ReviewMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {
    
    private final ReviewRepository reviewRepository;
    private final BookingRepository bookingRepository;
    private final ReviewMapper reviewMapper;
    
    @Override
    @Transactional
    public ReviewResponse createNewReview(Long customerId, CreateReviewRequest request) {
        // Check if the booking exists and belongs to the customer
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new AppException(ErrorCode.BOOKING_NOT_FOUND));
                
        if (!booking.getCustomerId().equals(customerId)) {
            throw new AppException(ErrorCode.BOOKING_NOT_BELONG);
        }
        
        // Check if the user is eligible to review (has completed the tour)
        if (!isUserEligibleToReview(booking)) {
            throw new AppException(ErrorCode.REVIEW_ELIGIBLE);
        }
        
        // If parentReviewId is provided, verify it exists
        if (request.getParentReviewId() != null) {
            reviewRepository.findById(request.getParentReviewId())
                    .orElseThrow(() -> new AppException(ErrorCode.PARENT_REVIEW_NOT_FOUND));
        }
        
        // Create and save the review
        Review review = Review.builder()
                .tourId(request.getTourId())
                .customerId(customerId)
                .bookingId(request.getBookingId())
                .parentReviewId(request.getParentReviewId())
                .rating(request.getRating())
                .comment(request.getComment())
                .photos(request.getPhotos())
                .build();
        
        Review savedReview = reviewRepository.save(review);
        
        return reviewMapper.toResponse(savedReview);
    }
    
    private boolean isUserEligibleToReview(Booking booking) {
        return booking.getStatus() == Booking.BookingStatus.COMPLETED;
    }
}