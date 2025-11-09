package group4.project.travelgoda.controller;

import group4.project.travelgoda.dto.response.ApiResponse;
import group4.project.travelgoda.dto.response.CategoryResponse;
import group4.project.travelgoda.dto.response.TourResponse;
import group4.project.travelgoda.dto.resquest.TourRequest;
import group4.project.travelgoda.service.impl.CategoryServiceImpl;
import group4.project.travelgoda.service.impl.TourServiceImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/tours")
public class TourTourProviderController {

    private final TourServiceImpl tourService;
    private final CategoryServiceImpl categoryService;

    @GetMapping
    public ApiResponse<Page<TourResponse>> getAllTour(Pageable pageable) {
        Page<TourResponse> tourResponse = tourService.getTourPage(pageable);
        return ApiResponse.<Page<TourResponse>>builder()
                .code(200)
                .message("Fetch all tour successfully!!!")
                .data(tourResponse)
                .build();
    }

    @GetMapping("/{tourId}")
    public ApiResponse<TourResponse> getTourById(@PathVariable long tourId) {
        TourResponse tourResponse = tourService.getTourDetail(tourId);
        return ApiResponse.<TourResponse>builder()
                .code(200)
                .message("Fetch tour by id successfully!!!")
                .data(tourResponse)
                .build();
    }

    @GetMapping("/categories")
    public ApiResponse<List<CategoryResponse>> getAllCategory() {
        List<CategoryResponse> categoryResponse = categoryService.getAllCategory();
        return ApiResponse.<List<CategoryResponse>>builder()
                .code(200)
                .message("Fetch all category successfully!!!")
                .data(categoryResponse)
                .build();
    }

    @PostMapping
    public ApiResponse<TourResponse> createTour(@RequestBody TourRequest tourRequest) {
        tourService.createTour(tourRequest);
        return ApiResponse.<TourResponse>builder()
                .code(200)
                .message("Create tour successfully!!!")
                .data(null)
                .build();
    }

    @PutMapping("/{tourId}")
    public ApiResponse<TourResponse> updateTour(@PathVariable long tourId, @RequestBody TourRequest tourRequest) {
        tourService.updateTour(tourId, tourRequest);
        return ApiResponse.<TourResponse>builder()
                .code(200)
                .message("Update tour successfully!!!")
                .data(null)
                .build();
    }

    @DeleteMapping("/{tourId}")
    public ApiResponse<TourResponse> deleteTour(@PathVariable long tourId) {
        tourService.deleteTour(tourId);
        return ApiResponse.<TourResponse>builder()
                .code(200)
                .message("Delete tour successfully!!!")
                .data(null)
                .build();
    }
}
