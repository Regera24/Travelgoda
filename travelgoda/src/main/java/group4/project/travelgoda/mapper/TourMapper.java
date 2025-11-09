package group4.project.travelgoda.mapper;


import group4.project.travelgoda.dto.tourDTO.TourDTO;
import group4.project.travelgoda.entity.Tour;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class TourMapper {

    public TourDTO toDTO(Tour src) {
        if (src == null) return null;

        TourDTO dto = new TourDTO();
        dto.setId(src.getId());
        dto.setTourProvider_Id(src.getProviderId());
        dto.setCategoryId(src.getCategoryId());
        dto.setName(src.getName());
        dto.setDescription(src.getDescription());
        dto.setTourType(src.getTourType());
        dto.setDurationDays(src.getDurationDays());
        dto.setStatus(src.getStatus());
        dto.setCreatedAt(src.getCreatedAt());
        dto.setUpdatedAt(src.getUpdatedAt());
        dto.setTourPrice(src.getTourPrice());
        return dto;
    }

    public Tour toEntity(TourDTO dto) {
        if (dto == null) return null;

        Tour entity = new Tour();
        entity.setId(dto.getId());
        entity.setProviderId(dto.getTourProvider_Id());
        entity.setCategoryId(dto.getCategoryId());
        entity.setName(dto.getName());
        entity.setDescription(dto.getDescription());
        entity.setTourType(dto.getTourType());
        entity.setDurationDays(dto.getDurationDays());
        entity.setStatus(dto.getStatus() != null ? dto.getStatus() : Tour.TourStatus.DRAFT);
        entity.setTourPrice(dto.getTourPrice());
        return entity;
    }


}
