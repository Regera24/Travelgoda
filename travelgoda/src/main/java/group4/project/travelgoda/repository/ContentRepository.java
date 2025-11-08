package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.Content;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ContentRepository extends JpaRepository<Content, Long>, ContentRepositoryCustom {
    
    List<Content> findByAuthorId(Long authorId);
    
    List<Content> findByContentType(Content.ContentType contentType);
    
    List<Content> findByStatus(Content.ContentStatus status);
    
    List<Content> findByContentTypeAndStatus(Content.ContentType contentType, Content.ContentStatus status);
}
