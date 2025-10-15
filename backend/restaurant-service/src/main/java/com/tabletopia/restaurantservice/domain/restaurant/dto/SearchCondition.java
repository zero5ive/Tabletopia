package com.tabletopia.restaurantservice.domain.restaurant.dto;

import lombok.Data;

/**
 * 레스토랑 검색 조건 DTO
 * @author 김예진
 * @since 2025-10-15
 */
@Data
public class SearchCondition {

  /**
   * 레스토랑 이름
   */
  private String name;

  /**
   * 주소
   */
  private String regionCode;

  /**
   * 카테고리 id
   */
  private Long categoryId;

  // 페이징용
  private Integer page = 0; // 기본 0페이지
  private Integer size = 6; // 기본 6개
}
