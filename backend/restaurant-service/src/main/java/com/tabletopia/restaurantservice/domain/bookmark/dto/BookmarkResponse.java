package com.tabletopia.restaurantservice.domain.bookmark.dto;

import com.tabletopia.restaurantservice.domain.bookmark.entity.Bookmark;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 북마크 조회 엔티티
 * @author 서예닮
 * @since 2025-10-16
 */
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkResponse {

  private Long bookmarkId;
  private Long restaurantId;
  private String restaurantName;
  private String address;
  private String categoryName;
  private String mainImageUrl;
  private LocalDateTime createdAt;

  /**
   * Entity -> DTO 변환
   */
  public static BookmarkResponse from(Bookmark bookmark) {
    return BookmarkResponse.builder()
        .bookmarkId(bookmark.getId())
        .restaurantId(bookmark.getRestaurant().getId())
        .restaurantName(bookmark.getRestaurant().getName())
        .address(bookmark.getRestaurant().getAddress())
        .categoryName(bookmark.getRestaurant().getRestaurantCategory().getName())
        .mainImageUrl(getMainImageUrl(bookmark))
        .createdAt(bookmark.getCreatedAt())
        .build();
  }

  /**
   * 메인 이미지 URL 가져오기
   */
  private static String getMainImageUrl(Bookmark bookmark) {
    var restaurant = bookmark.getRestaurant();

    if (restaurant.getRestaurantImage() == null || restaurant.getRestaurantImage().isEmpty()) {
      return null;
    }

    return restaurant.getRestaurantImage().stream()
        .filter(img -> img.isMain() && img.getImageUrl() != null)
        .findFirst()
        .map(img -> img.getImageUrl())
        .orElseGet(() -> restaurant.getRestaurantImage().stream()
            .filter(img -> img.getImageUrl() != null)
            .findFirst()
            .map(img -> img.getImageUrl())
            .orElse(null));
  }
}
