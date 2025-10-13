package com.tabletopia.restaurantservice.domain.restaurantcaCategory.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CategorySimpleResponse {
  private Long id;
  private String name;
  private Integer displayOrder;

}
