package com.tabletopia.restaurantservice.domain.restaurantreview.repository;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview.SourceType;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 레스토랑 리뷰 리포지토리
 *
 * @author 김예진
 * @since 2025-10-16
 */
public interface RestaurantReviewRepository extends JpaRepository<RestaurantReview, Long> {

  /**
   * 레스토랑의 리뷰 목록 조회 (User fetch join으로 N+1 문제 해결)
   * @author 김예진
   * @since 2025-10-16
   * @param restaurantId
   * @return
   */
  @Query("SELECT r FROM RestaurantReview r JOIN FETCH r.user WHERE r.restaurant.id = :restaurantId")
  List<RestaurantReview> getRestaurantReviewsByRestaurant_Id(@Param("restaurantId") Long restaurantId);

  /**
   * 사용자의 리뷰 목록 조회 (Restaurant fetch join으로 N+1 문제 해결)
   * @author 서예닮
   * @since 2025-10-19
   * @param userId
   * @return
   */
  @Query("SELECT r FROM RestaurantReview r JOIN FETCH r.restaurant WHERE r.user.id = :userId AND r.isDeleted = false ORDER BY r.createdAt DESC")
  List<RestaurantReview> findByUserId(@Param("userId") Long userId);

  /**
   * 중복 리뷰 체크 (삭제되지 않은 리뷰 중)
   * @author 서예닮
   * @since 2025-10-19
   * @param userId
   * @param sourceId
   * @param sourceType
   * @return
   */
  boolean existsByUserIdAndSourceIdAndSourceTypeAndIsDeletedFalse(
      Long userId, Long sourceId, SourceType sourceType);

}
