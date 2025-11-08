package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Destination;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DestinationRepository extends JpaRepository<Destination, Integer> {
    
    List<Destination> findByCountry(String country);
    
    List<Destination> findByNameContainingIgnoreCase(String name);
}
