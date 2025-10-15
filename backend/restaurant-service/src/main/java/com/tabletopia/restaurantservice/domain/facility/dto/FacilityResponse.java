package com.tabletopia.restaurantservice.domain.facility.dto;

import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 편의시설 정보를 응답 형태로 전달하기 위한 DTO
 *
 * Facility 엔티티의 주요 속성(id, name)만을 포함하며,
 * 클라이언트에 표시할 수 있는 단순한 형태의 데이터를 제공한다.
 *
 * 예:
 * {
 *   "id": 1,
 *   "name": "Wi-Fi"
 * }
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Getter
@NoArgsConstructor
public class FacilityResponse {

  /** 편의시설 ID */
  private Long id;

  /** 편의시설 이름 */
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
