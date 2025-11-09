package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.response.TourResponse;
import group4.project.travelgoda.dto.resquest.TourRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TourService {
    /**
     * Get tour information for tour guide
     * @param tourId Tour ID
     * @param guideId Tour Guide ID
     * @return Tour information or null if not found
     */
    TourInfoResponse getTourInfoForGuide(Long tourId, Long guideId);

    Page<TourResponse> getTourPage(Pageable pageable);

    TourResponse getTourDetail(long tourId);

    void createTour(TourRequest tourRequest);

    void updateTour(long tourId, TourRequest tourRequest);

    void deleteTour(long tourId);

    /**
     * Get all tours assigned to a tour guide
     * @param guideId Tour Guide ID
     * @return List of tours
     */
    List<TourInfoResponse> getToursForGuide(Long guideId);
}
