package group4.project.travelgoda.repository.impl;

import group4.project.travelgoda.entity.Content;
import group4.project.travelgoda.repository.ContentRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Repository
@Transactional
public class ContentRepositoryImpl implements ContentRepositoryCustom {
    
    @PersistenceContext
    private EntityManager entityManager;
    
    @Override
    public List<Content> findPublishedContent(Content.ContentType contentType, int limit) {
        String jpql = """
            SELECT c FROM Content c 
            WHERE c.status = :status 
            AND c.contentType = :contentType 
            ORDER BY c.publishedAt DESC
        """;
        TypedQuery<Content> query = entityManager.createQuery(jpql, Content.class);
        query.setParameter("status", Content.ContentStatus.PUBLISHED);
        query.setParameter("contentType", contentType);
        query.setMaxResults(limit);
        return query.getResultList();
    }
    
    @Override
    public void publishContent(Long contentId) {
        String jpql = """
            UPDATE Content c 
            SET c.status = :status, c.publishedAt = :publishedAt 
            WHERE c.id = :contentId
        """;
        entityManager.createQuery(jpql)
                .setParameter("status", Content.ContentStatus.PUBLISHED)
                .setParameter("publishedAt", LocalDateTime.now())
                .setParameter("contentId", contentId)
                .executeUpdate();
    }
    
    @Override
    public List<Content> searchPublishedContent(String keyword) {
        String jpql = """
            SELECT c FROM Content c 
            WHERE c.status = :status 
            AND (LOWER(c.title) LIKE LOWER(:keyword) OR LOWER(c.body) LIKE LOWER(:keyword))
            ORDER BY c.publishedAt DESC
        """;
        TypedQuery<Content> query = entityManager.createQuery(jpql, Content.class);
        query.setParameter("status", Content.ContentStatus.PUBLISHED);
        query.setParameter("keyword", "%" + keyword + "%");
        return query.getResultList();
    }
}
