package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Schedule;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ScheduleRepository extends JpaRepository<Schedule, Long>, ScheduleRepositoryCustom {
    
    List<Schedule> findByTourId(Long tourId);
    
    List<Schedule> findByGuideId(Long guideId);
    
    List<Schedule> findByStartDateAfter(LocalDateTime startDate);
    
    List<Schedule> findByTourIdAndStartDateAfter(Long tourId, LocalDateTime startDate);
}
