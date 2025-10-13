package com.tabletopia.restaurantservice.domain.restaurantMenu.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.*;

/**
 * 메뉴 응답 DTO
 * 메뉴 등록, 조회 시 클라이언트로 반환되는 데이터 객체이다.
 * 이미지 파일명은 실제 파일명만 포함한다.
 * @author 김지민
 * @since 2025-10-10
 */
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantMenuResponse {

  private Long id;
  private Long restaurantId;
  private String name;
  private int price;
  private String description;
  private String category;
  private String imageFilename;
  @JsonProperty("isSoldout")
  private boolean isSoldout;

}
