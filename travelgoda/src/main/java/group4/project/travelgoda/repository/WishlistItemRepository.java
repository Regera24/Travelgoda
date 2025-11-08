package group4.project.travelgoda.repository;

import group4.project.travelgoda.entity.WishlistItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WishlistItemRepository extends JpaRepository<WishlistItem, WishlistItem.WishlistItemId> {
    
    @Query("SELECT w FROM WishlistItem w WHERE w.id.customerId = :customerId ORDER BY w.addedAt DESC")
    List<WishlistItem> findByCustomerId(@Param("customerId") Long customerId);
    
    @Query("SELECT w FROM WishlistItem w WHERE w.id.tourId = :tourId")
    List<WishlistItem> findByTourId(@Param("tourId") Long tourId);
    
    @Query("SELECT COUNT(w) FROM WishlistItem w WHERE w.id.tourId = :tourId")
    Long countByTourId(@Param("tourId") Long tourId);
}
