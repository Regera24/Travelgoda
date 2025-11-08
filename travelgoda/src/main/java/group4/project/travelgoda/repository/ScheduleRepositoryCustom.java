package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Schedule;

import java.time.LocalDateTime;
import java.util.List;

public interface ScheduleRepositoryCustom {
    
    List<Schedule> findAvailableSchedules(Long tourId, LocalDateTime fromDate);
    
    void updateBookedSlots(Long scheduleId, Integer slots);
    
    List<Schedule> findUpcomingSchedulesByGuide(Long guideId);
}
