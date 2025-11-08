package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long>, ReviewRepositoryCustom {
    
    List<Review> findByTourId(Long tourId);
    
    List<Review> findByCustomerId(Long customerId);
    
    List<Review> findByBookingId(Long bookingId);
    
    List<Review> findByParentReviewId(Long parentReviewId);
    
    List<Review> findByTourIdAndParentReviewIdIsNull(Long tourId);
}
