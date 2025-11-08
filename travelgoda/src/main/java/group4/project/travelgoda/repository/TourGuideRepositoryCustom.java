package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.TourGuide;

import java.util.List;

public interface TourGuideRepositoryCustom {
    
    List<TourGuide> findGuidesByLanguage(String language);
    
    List<TourGuide> findAvailableGuidesForSchedule(Long scheduleId);
}
