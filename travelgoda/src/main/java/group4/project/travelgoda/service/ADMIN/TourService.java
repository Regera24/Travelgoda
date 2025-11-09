package group4.project.travelgoda.service.ADMIN;

import group4.project.travelgoda.dto.tourDTO.TourDTO;
import group4.project.travelgoda.entity.Tour;

import java.util.List;

public interface TourService {
    List<TourDTO> findAll();
    TourDTO findById(Long id);
    TourDTO create(TourDTO tour);
    TourDTO update(Long id,TourDTO tour);
    TourDTO delete(TourDTO tour);
    void changeStatus(Long id, Tour.TourStatus newStatus);

}
