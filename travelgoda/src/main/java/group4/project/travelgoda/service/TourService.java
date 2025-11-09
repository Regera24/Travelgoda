package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.response.TourInfoResponse;

import java.util.List;

public interface TourService {
    /**
     * Get tour information for tour guide
     * @param tourId Tour ID
     * @param guideId Tour Guide ID
     * @return Tour information or null if not found
     */
    TourInfoResponse getTourInfoForGuide(Long tourId, Long guideId);

    /**
     * Get all tours assigned to a tour guide
     * @param guideId Tour Guide ID
     * @return List of tours
     */
    List<TourInfoResponse> getToursForGuide(Long guideId);
}
