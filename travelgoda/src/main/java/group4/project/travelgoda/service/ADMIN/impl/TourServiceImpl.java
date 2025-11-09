package group4.project.travelgoda.service.ADMIN.impl;

import group4.project.travelgoda.dto.tourDTO.TourDTO;
import group4.project.travelgoda.entity.Tour;
import group4.project.travelgoda.mapper.TourMapper;
import group4.project.travelgoda.repository.TourRepository;
import group4.project.travelgoda.service.ADMIN.TourService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TourServiceImpl implements TourService {

    private final TourRepository tourRepository;
    private final TourMapper tourMapper;

    @Override
    public List<TourDTO> findAll() {
        return tourRepository.findAll().stream().map(tour -> tourMapper.toDTO(tour)).collect(Collectors.toList());
    }

    @Override
    public TourDTO findById(Long id) {
        return tourRepository.findById(id).map(tour -> tourMapper.toDTO(tour)).orElse(null);
    }

    @Override
    public TourDTO create(TourDTO tour) {
        return tourMapper.toDTO(tourRepository.save(tourMapper.toEntity(tour)));
    }

    @Override
    public TourDTO update(Long id, TourDTO tour) {
        Tour a = tourRepository.findById(id).orElse(null);
        a.setTourPrice(tour.getTourPrice());
        a.setUpdatedAt(tour.getUpdatedAt());
        a.setStatus(tour.getStatus());
        a.setCategoryId(tour.getCategoryId());
        a.setName(tour.getName());
        a.setDurationDays(tour.getDurationDays());
        a.setCreatedAt(tour.getCreatedAt());
        a.setDescription(tour.getDescription());
        a.setTourType(tour.getTourType());
        tourRepository.save(a);

        return tourMapper.toDTO(a);
    }

    @Override
    public TourDTO delete(TourDTO tour) {
        Tour a=tourRepository.findById(tour.getTourProvider_Id()).orElse(null);
        a.setStatus(tour.getStatus());
        return tourMapper.toDTO(a);
    }

    @Override
    public void changeStatus(Long id, Tour.TourStatus newStatus) {
        Tour a = tourRepository.findById(id).orElse(null);
        a.setStatus(newStatus);
        tourRepository.save(a);
    }
}
