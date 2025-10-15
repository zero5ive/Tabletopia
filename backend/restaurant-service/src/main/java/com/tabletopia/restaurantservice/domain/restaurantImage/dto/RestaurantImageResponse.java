package com.tabletopia.restaurantservice.domain.restaurantImage.dto;

import com.tabletopia.restaurantservice.domain.restaurantImage.entity.RestaurantImage;
import lombok.*;

/**
 * 매장 이미지 조회 응답 DTO
 *
 * 매장 이미지 정보 반환용 데이터 전송 객체.
 * 이미지 ID, URL, 대표 여부, 정렬 순서를 포함한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantImageResponse {
  private Long id;
  private String imageUrl;
  private boolean isMain;
  private int sortOrder;

  public static RestaurantImageResponse from(RestaurantImage entity) {
    return RestaurantImageResponse.builder()
        .id(entity.getId())
        .imageUrl("/uploads/restaurants/" + entity.getImageUrl()) // URL 조합
        .isMain(entity.isMain())
        .sortOrder(entity.getSortOrder())
        .build();
  }
}
