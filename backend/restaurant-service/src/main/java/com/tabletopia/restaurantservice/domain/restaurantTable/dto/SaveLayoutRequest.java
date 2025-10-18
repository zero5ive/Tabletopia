package com.tabletopia.restaurantservice.domain.restaurantTable.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * 좌석 배치 생성 요청 DTO
 * @author 김예진
 * @since 2025-10-18
 */
@Data
public class SaveLayoutRequest {
  private List<TableLayout> tables;

  @Getter
  @Setter
  public static class TableLayout {
    private Long id;              // null이면 신규, 있으면 수정
    private String name;

    @JsonProperty("minCapacity")
    private Integer minCapacity;

    @JsonProperty("maxCapacity")
    private Integer maxCapacity;

    @JsonProperty("xPosition")
    private Integer xPosition;

    @JsonProperty("yPosition")
    private Integer yPosition;

    private String shape;
  }
}
