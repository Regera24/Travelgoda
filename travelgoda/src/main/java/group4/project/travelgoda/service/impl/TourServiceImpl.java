package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.response.TourInfoResponse;
import group4.project.travelgoda.entity.*;
import group4.project.travelgoda.repository.*;
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
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final ScheduleRepository scheduleRepository;
    private final TourGuideRepository tourGuideRepository;
    private final TourProviderRepository tourProviderRepository;
    private final CategoryRepository categoryRepository;
    private final TourDestinationRepository tourDestinationRepository;
    private final UserRepository userRepository;

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
    @Transactional(readOnly = true)
    public TourInfoResponse getTourInfoForGuide(Long tourId, Long guideId) {
        // Verify tour guide exists
        TourGuide tourGuide = tourGuideRepository.findById(guideId).orElse(null);
        if (tourGuide == null) {
            return null;
        }

        // Find tour
        Tour tour = tourRepository.findById(tourId).orElse(null);
        if (tour == null) {
            return null;
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

        // Check if guide is assigned to this tour through schedules
        List<Schedule> schedules = scheduleRepository.findByTourId(tourId);
        boolean isGuideAssigned = schedules.stream()
                .anyMatch(schedule -> schedule.getGuideId() != null && schedule.getGuideId().equals(guideId));

        if (!isGuideAssigned) {
            // Guide not assigned to this tour, return null
            return null;
        }

        return buildTourInfoResponse(tour, schedules, guideId);
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
        @Override
        @Transactional(readOnly = true)
        public List<TourInfoResponse> getToursForGuide(Long guideId) {
            // Verify tour guide exists
            TourGuide tourGuide = tourGuideRepository.findById(guideId).orElse(null);
            if (tourGuide == null) {
                return List.of();
            }

            // Find all schedules assigned to this guide
            List<Schedule> guideSchedules = scheduleRepository.findByGuideId(guideId);

            // Get unique tour IDs
            List<Long> tourIds = guideSchedules.stream()
                    .map(Schedule::getTourId)
                    .distinct()
                    .collect(Collectors.toList());

            // Get tours
            List<Tour> tours = tourRepository.findAllById(tourIds);

            return tours.stream()
                    .map(tour -> {
                        List<Schedule> tourSchedules = guideSchedules.stream()
                                .filter(schedule -> schedule.getTourId().equals(tour.getId()))
                                .collect(Collectors.toList());
                        return buildTourInfoResponse(tour, tourSchedules, guideId);
                    })
                    .collect(Collectors.toList());
        }

        private TourInfoResponse buildTourInfoResponse(Tour tour, List<Schedule> schedules, Long guideId) {
            // Get provider info
            String providerName = null;
            if (tour.getProviderId() != null) {
                TourProvider provider = tourProviderRepository.findById(tour.getProviderId()).orElse(null);
                if (provider != null && provider.getUser() != null) {
                    providerName = provider.getUser().getEmail();
                }
            }

            // Get category info
            String categoryName = null;
            if (tour.getCategoryId() != null) {
                Category category = categoryRepository.findById(tour.getCategoryId()).orElse(null);
                if (category != null) {
                    categoryName = category.getName();
                }
            }

            // Get destinations
            List<String> destinations = tourDestinationRepository.findByTourId(tour.getId())
                    .stream()
                    .map(td -> {
                        if (td.getDestination() != null) {
                            return td.getDestination().getName();
                        }
                        return null;
                    })
                    .filter(name -> name != null)
                    .collect(Collectors.toList());

            // Build schedule info list
            List<TourInfoResponse.ScheduleInfo> scheduleInfos = schedules.stream()
                    .map(schedule -> {
                        String guideName = null;
                        if (schedule.getGuideId() != null) {
                            TourGuide guide = tourGuideRepository.findById(schedule.getGuideId()).orElse(null);
                            if (guide != null && guide.getUser() != null) {
                                guideName = guide.getUser().getEmail();
                            }
                        }

                        return TourInfoResponse.ScheduleInfo.builder()
                                .scheduleId(schedule.getId())
                                .startDate(schedule.getStartDate())
                                .endDate(schedule.getEndDate())
                                .availableSlots(schedule.getAvailableSlots())
                                .bookedSlots(schedule.getBookedSlots())
                                .guideId(schedule.getGuideId())
                                .guideName(guideName)
                                .build();
                    })
                    .collect(Collectors.toList());

            return TourInfoResponse.builder()
                    .tourId(tour.getId())
                    .tourName(tour.getName())
                    .description(tour.getDescription())
                    .itinerary(tour.getItinerary())
                    .tourType(tour.getTourType())
                    .durationDays(tour.getDurationDays())
                    .groupSize(tour.getGroupSize())
                    .status(tour.getStatus() != null ? tour.getStatus().name() : null)
                    .averageRating(tour.getAverageRating())
                    .createdAt(tour.getCreatedAt())
                    .updatedAt(tour.getUpdatedAt())
                    .providerId(tour.getProviderId())
                    .providerName(providerName)
                    .categoryId(tour.getCategoryId())
                    .categoryName(categoryName)
                    .schedules(scheduleInfos)
                    .destinations(destinations)
                    .build();
        }
}
