package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.TourGuide;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourGuideRepository extends JpaRepository<TourGuide, Long>, TourGuideRepositoryCustom {
    
    List<TourGuide> findByProviderId(Long providerId);
}
