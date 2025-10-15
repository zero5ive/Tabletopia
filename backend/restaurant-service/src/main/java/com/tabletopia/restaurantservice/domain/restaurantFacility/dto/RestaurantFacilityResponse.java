package com.tabletopia.restaurantservice.domain.restaurantFacility.dto;

import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 매장별 편의시설 정보를 클라이언트에 전달하기 위한 DTO
 *
 * 매장(Restaurant)에 연결된 편의시설(Facility)의 기본 정보만 포함한다.
 * 활성화 여부(isActive) 등의 상태는 포함하지 않는다.
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Getter
@NoArgsConstructor
public class RestaurantFacilityResponse {

  /** 편의시설 ID */
  private Long facilityId;

  /** 편의시설 이름 */
  private String facilityName;

  /**
   * 엔티티를 DTO로 변환하는 생성자
   *
   * @param entity 매장 편의시설 엔티티
   */
  public RestaurantFacilityResponse(RestaurantFacility entity) {
    this.facilityId = entity.getFacility().getId();
    this.facilityName = entity.getFacility().getName();
  }
}
