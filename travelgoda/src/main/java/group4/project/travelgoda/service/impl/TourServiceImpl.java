package group4.project.travelgoda.service.impl;

import group4.project.travelgoda.dto.response.TourInfoResponse;
import group4.project.travelgoda.entity.*;
import group4.project.travelgoda.repository.*;
import group4.project.travelgoda.service.TourService;
import lombok.RequiredArgsConstructor;
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
