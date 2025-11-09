package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.response.ApiResponse;
import group4.project.travelgoda.dto.response.TourInfoResponse;
import group4.project.travelgoda.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tours")
public class TourController {
    private final TourService tourService;

    /**
     * Get tour information for tour guide
     * @param tourId Tour ID
     * @param guideId Tour Guide ID
     * @return Tour information
     */
    @GetMapping("/{tourId}/guide/{guideId}")
    public ApiResponse<TourInfoResponse> getTourInfoForGuide(
            @PathVariable Long tourId,
            @PathVariable Long guideId) {
        TourInfoResponse tourInfo = tourService.getTourInfoForGuide(tourId, guideId);
        
        if (tourInfo == null) {
            return ApiResponse.<TourInfoResponse>builder()
                    .code(HttpStatus.NOT_FOUND.value())
                    .message("Tour not found")
                    .build();
        }
        
        return ApiResponse.<TourInfoResponse>builder()
                .code(HttpStatus.OK.value())
                .message("Get tour information successfully")
                .data(tourInfo)
                .build();
    }

    /**
     * Get all tours assigned to a tour guide
     * @param guideId Tour Guide ID
     * @return List of tours
     */
    @GetMapping("/guide/{guideId}")
    public ApiResponse<java.util.List<TourInfoResponse>> getToursForGuide(@PathVariable Long guideId) {
        java.util.List<TourInfoResponse> tours = tourService.getToursForGuide(guideId);
        
        return ApiResponse.<java.util.List<TourInfoResponse>>builder()
                .code(HttpStatus.OK.value())
                .message("Get tours successfully")
                .data(tours)
                .build();
    }
}
