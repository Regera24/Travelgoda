package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Content;

import java.util.List;

public interface ContentRepositoryCustom {
    
    List<Content> findPublishedContent(Content.ContentType contentType, int limit);
    
    void publishContent(Long contentId);
    
    List<Content> searchPublishedContent(String keyword);
}
