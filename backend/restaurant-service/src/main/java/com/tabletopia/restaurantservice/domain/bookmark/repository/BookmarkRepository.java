package com.tabletopia.restaurantservice.domain.bookmark.repository;

import com.tabletopia.restaurantservice.domain.bookmark.entity.Bookmark;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
/**
 * 북마크
 * @author 서예닮
 * @since 2025-10-16
 */
public interface BookmarkRepository extends JpaRepository<Bookmark, Long> {

  /**
   * 사용자별 북마크 목록 조회 (페이징)
   */
  @Query(value = "SELECT DISTINCT b FROM Bookmark b " +
         "JOIN FETCH b.restaurant r " +
         "JOIN FETCH r.restaurantCategory " +
         "WHERE b.user.id = :userId",
         countQuery = "SELECT COUNT(b) FROM Bookmark b WHERE b.user.id = :userId")
  Page<Bookmark> findByUserIdWithRestaurant(@Param("userId") Long userId, Pageable pageable);
}
