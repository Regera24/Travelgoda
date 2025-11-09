package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.response.CategoryResponse;
import group4.project.travelgoda.dto.response.TourDestinationResponse;
import group4.project.travelgoda.dto.response.TourResponse;
import group4.project.travelgoda.dto.resquest.TourRequest;
import group4.project.travelgoda.entity.Tour;
import group4.project.travelgoda.repository.CategoryRepository;
import group4.project.travelgoda.repository.TourRepository;
import group4.project.travelgoda.service.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final CategoryRepository categoryRepository;

    @Override
    public Page<TourResponse> getTourPage(Pageable pageable) {

        return tourRepository.findAll(pageable)
                .map(tour -> new TourResponse(
                        tour.getId(),
                        tour.getName(),
                        "image chua co",
                        tour.getTourPrice(),
                        tour.getDescription(),
                        tour.getTourDestinations().stream().map(
                                tourDestination -> new TourDestinationResponse(
                                        tourDestination.getDestination().getName(),
                                        tourDestination.getDestination().getCountry(),
                                        tourDestination.getDestination().getLocation()
                                )
                        ).collect(Collectors.toSet()),
                        tour.getDurationDays(),
                        tour.getGroupSize(),
                        new CategoryResponse(tour.getCategory().getId(), tour.getCategory().getName(), tour.getCategory().getDescription()),
                        tour.getAverageRating(),
                        String.valueOf(tour.getStatus()),
                        tour.getItinerary()
                ));
    }


    @Override
    public TourResponse getTourDetail(long tourId) {
        Tour tour = tourRepository.findById(tourId).get();
        return new TourResponse(
                tour.getId(),
                tour.getName(),
                "image chua co",
                tour.getTourPrice(),
                tour.getDescription(),
                tour.getTourDestinations().stream().map(
                        tourDestination -> new TourDestinationResponse(
                                tourDestination.getDestination().getName(),
                                tourDestination.getDestination().getCountry(),
                                tourDestination.getDestination().getLocation()
                        )
                ).collect(Collectors.toSet()),
                tour.getDurationDays(),
                tour.getGroupSize(),
                new CategoryResponse(tour.getCategory().getId(), tour.getCategory().getName(), tour.getCategory().getDescription()),
                tour.getAverageRating(),
                String.valueOf(tour.getStatus()),
                tour.getItinerary()
        );

    }

    @Override
    public void createTour(TourRequest tourRequest) {

        Tour tour = new Tour();
        tour.setName(tourRequest.getName());
        tour.setTourPrice(tourRequest.getTourPrice());
        tour.setDescription(tourRequest.getDescription());
        tour.setDurationDays(tourRequest.getDurationDays());
        tour.setCategoryId(tourRequest.getCategoryId());
        tour.setStatus(Tour.TourStatus.valueOf("DRAFT"));
        tour.setGroupSize(tourRequest.getGroupSize());
        tour.setProviderId(6L); // để tạm do chưa có phần security context
        tourRepository.save(tour);
    }

    @Override
    public void updateTour(long tourId, TourRequest tourRequest) {
        Tour tour = tourRepository.findById(tourId).get();
        tour.setName(tourRequest.getName());
        tour.setTourPrice(tourRequest.getTourPrice());
        tour.setDescription(tourRequest.getDescription());
        tour.setDurationDays(tourRequest.getDurationDays());
        tour.setCategoryId(tourRequest.getCategoryId());
        tour.setStatus(Tour.TourStatus.valueOf("DRAFT"));
        tour.setGroupSize(tourRequest.getGroupSize());
        tourRepository.save(tour);
    }

    @Override
    public void deleteTour(long tourId) {
        Tour tour = tourRepository.findById(tourId).get();
        tour.setStatus(Tour.TourStatus.valueOf("DRAFT"));
        tourRepository.save(tour);
    }
}
