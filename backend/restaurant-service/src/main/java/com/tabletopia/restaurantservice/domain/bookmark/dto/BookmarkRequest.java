package com.tabletopia.restaurantservice.domain.bookmark.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 북마크 등록 디티오
 * @author 성유진
 * @since 2025-10-18
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class BookmarkRequest {

  private Long userId;
  private Long restaurantId;

}
