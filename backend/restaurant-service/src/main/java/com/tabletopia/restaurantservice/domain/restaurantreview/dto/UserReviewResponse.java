package com.tabletopia.restaurantservice.domain.restaurantreview.dto;

import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview.SourceType;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 사용자별 리뷰 응답 객체 (레스토랑 정보 포함)
 *
 * @author 서예닮
 * @since 2025-10-19
 */
@Data
@AllArgsConstructor
public class UserReviewResponse {

  private Long id;

  private Long restaurantId;

  private String restaurantName;

  private Integer rating;

  private String comment;

  private SourceType sourceType; // RESERVATION 또는 WAITING

  private Long sourceId;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  /**
   * 엔티티 -> DTO 변환
   * @param review
   * @return
   */
  public static UserReviewResponse from(RestaurantReview review) {
    return new UserReviewResponse(
        review.getId(),
        review.getRestaurant().getId(),
        review.getRestaurant().getName(),
        review.getRating(),
        review.getComment(),
        review.getSourceType(),
        review.getSourceId(),
        review.getCreatedAt(),
        review.getUpdatedAt()
    );
  }
}
