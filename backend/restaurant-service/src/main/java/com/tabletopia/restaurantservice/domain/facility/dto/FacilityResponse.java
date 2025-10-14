package com.tabletopia.restaurantservice.domain.facility.dto;

import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 편의시설 정보를 응답 형태로 전달하기 위한 DTO
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@NoArgsConstructor
public class FacilityResponse{

  private Long id;
  private String name;

  /**
   * 엔티티를 DTO로 변환하는 생성자
   *
   * @param facility 편의시설 엔티티
   */
  public FacilityResponse(Facility facility) {
    this.id = facility.getId();
    this.name = facility.getName();
  }
}