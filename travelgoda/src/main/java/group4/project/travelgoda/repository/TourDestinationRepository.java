package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.TourDestination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TourDestinationRepository extends JpaRepository<TourDestination, TourDestination.TourDestinationId> {
    
    @Query("SELECT td FROM TourDestination td WHERE td.id.tourId = :tourId")
    List<TourDestination> findByTourId(@Param("tourId") Long tourId);
    
    @Query("SELECT td FROM TourDestination td WHERE td.id.destinationId = :destinationId")
    List<TourDestination> findByDestinationId(@Param("destinationId") Integer destinationId);
}
