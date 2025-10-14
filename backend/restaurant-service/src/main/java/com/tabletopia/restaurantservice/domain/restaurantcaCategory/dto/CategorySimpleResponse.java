package com.tabletopia.restaurantservice.domain.restaurantcaCategory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 레스토랑 카테고리 디티오
 *
 * @author 성유진
 * @since 2025-10-13
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySimpleResponse {
  private Long id;
  private String name;
  private Integer displayOrder;

}
