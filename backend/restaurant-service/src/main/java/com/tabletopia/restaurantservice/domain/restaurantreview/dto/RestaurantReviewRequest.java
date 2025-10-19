package com.tabletopia.restaurantservice.domain.restaurantreview.dto;

import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview.SourceType;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 리뷰 작성 요청 DTO
 *
 * @author 서예닮
 * @since 2025-10-19
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class RestaurantReviewRequest {

  @NotNull(message = "레스토랑 ID는 필수입니다")
  private Long restaurantId;

  @NotNull(message = "평점은 필수입니다")
  @Min(value = 1, message = "평점은 1점 이상이어야 합니다")
  @Max(value = 5, message = "평점은 5점 이하여야 합니다")
  private Integer rating;

  @NotBlank(message = "리뷰 내용은 필수입니다")
  private String comment;

  @NotNull(message = "예약/웨이팅 ID는 필수입니다")
  private Long sourceId;

  @NotNull(message = "리뷰 출처(RESERVATION/WAITING)는 필수입니다")
  private SourceType sourceType;
}
