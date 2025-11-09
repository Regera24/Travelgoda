package group4.project.travelgoda.service;

import group4.project.travelgoda.dto.response.TourResponse;
import group4.project.travelgoda.dto.resquest.TourRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface TourService {

    Page<TourResponse> getTourPage(Pageable pageable);

    TourResponse getTourDetail(long tourId);

    void createTour(TourRequest tourRequest);

    void updateTour(long tourId, TourRequest tourRequest);

    void deleteTour(long tourId);
}
