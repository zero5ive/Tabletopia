package com.tabletopia.restaurantservice.domain.restaurantreview.dto;

import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * 레스토랑 리뷰 응답 객체
 *
 * @author 김예진
 * @since 2025-10-16
 */
@Data
@AllArgsConstructor
public class RestaurantReviewResponse {

  private Long id;

  private String userName;

  private Integer rating;

  private String comment;

  private LocalDateTime createdAt;

  private LocalDateTime updatedAt;

  /**
   * 엔티티 -> dto
   * @param review
   * @return
   */
  public static RestaurantReviewResponse from(RestaurantReview review) {
    return new RestaurantReviewResponse(
        review.getId(),
        review.getUser().getName(),
        review.getRating(),
        review.getComment(),
        review.getCreatedAt(),
        review.getUpdatedAt()
    );
  }
}
