package com.tabletopia.restaurantservice.domain.restaurantTable.dto;

import lombok.Data;

/**
 * 테이블 생성 요청 DTO
 * @author 김예진
 * @since 2025-10-18
 */
@Data
public class CreateTableRequest {
  private String name; // "사각테이블 1"
  private Integer minCapacity; // 2
  private Integer maxCapacity; // 4
  private Integer xPosition; // 100
  private Integer yPosition; // 150
  private String shape; // "RECTANGLE" or "CIRCLE"
}
