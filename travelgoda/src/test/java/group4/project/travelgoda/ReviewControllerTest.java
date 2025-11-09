package group4.project.travelgoda;

import com.fasterxml.jackson.databind.ObjectMapper;
import group4.project.travelgoda.dto.request.CreateReviewRequest;
import group4.project.travelgoda.entity.Booking;
import group4.project.travelgoda.entity.Review;
import group4.project.travelgoda.repository.BookingRepository;
import group4.project.travelgoda.repository.ReviewRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Arrays;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class ReviewControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private BookingRepository bookingRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    private static final Long CUSTOMER_ID = 1L;
    private static final Long TOUR_ID = 1L;
    private static final Long BOOKING_ID = 1L;

    @BeforeEach
    void setUp() {
        // Clean up the repositories
        reviewRepository.deleteAll();
        bookingRepository.deleteAll();
        bookingRepository.flush(); // Ensure all deletes are committed

        // Create a test booking with COMPLETED status
        Booking booking = new Booking(); // Use constructor instead of builder
        booking.setCustomerId(CUSTOMER_ID);
        booking.setScheduleId(1L);
        booking.setBookingReference("TEST-" + BOOKING_ID);
        booking.setNumberOfPeople(2);
        booking.setTotalAmount(new BigDecimal("100.00"));
        booking.setStatus(Booking.BookingStatus.COMPLETED);
        bookingRepository.saveAndFlush(booking); // Use saveAndFlush to ensure the save is committed
    }

    @Test
    void createReview_ValidRequest_ShouldReturnCreated() throws Exception {
        // Arrange
        CreateReviewRequest request = CreateReviewRequest.builder()
                .tourId(TOUR_ID)
                .bookingId(BOOKING_ID)
                .rating(5)
                .comment("Great tour experience!")
                .photos(Arrays.asList("photo1.jpg", "photo2.jpg"))
                .build();

        // Act & Assert
        ResultActions result = mockMvc.perform(post("/api/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("X-Customer-ID", CUSTOMER_ID)); // Simulating authenticated user

        result.andExpect(status().isCreated())
                .andExpect(jsonPath("$.tourId").value(TOUR_ID))
                .andExpect(jsonPath("$.customerId").value(CUSTOMER_ID))
                .andExpect(jsonPath("$.rating").value(5))
                .andExpect(jsonPath("$.comment").value("Great tour experience!"));
    }

    @Test
    void createReview_BookingNotCompleted_ShouldReturnBadRequest() throws Exception {
        // Arrange
        // Create a booking with PENDING status
        Booking pendingBooking = new Booking();
        pendingBooking.setCustomerId(CUSTOMER_ID);
        pendingBooking.setScheduleId(1L);
        pendingBooking.setBookingReference("TEST-PENDING-2");
        pendingBooking.setNumberOfPeople(2);
        pendingBooking.setTotalAmount(new BigDecimal("100.00"));
        pendingBooking.setStatus(Booking.BookingStatus.PENDING);
        bookingRepository.save(pendingBooking);

        CreateReviewRequest request = CreateReviewRequest.builder()
                .tourId(TOUR_ID)
                .bookingId(2L)
                .rating(5)
                .comment("Great tour experience!")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("X-Customer-ID", CUSTOMER_ID))
                .andExpect(status().isBadRequest());
    }

    @Test
    void createReview_InvalidBooking_ShouldReturnNotFound() throws Exception {
        // Arrange
        CreateReviewRequest request = CreateReviewRequest.builder()
                .tourId(TOUR_ID)
                .bookingId(999L) // Non-existent booking ID
                .rating(5)
                .comment("Great tour experience!")
                .build();

        // Act & Assert
        mockMvc.perform(post("/api/reviews")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(request))
                .header("X-Customer-ID", CUSTOMER_ID))
                .andExpect(status().isNotFound());
    }
}