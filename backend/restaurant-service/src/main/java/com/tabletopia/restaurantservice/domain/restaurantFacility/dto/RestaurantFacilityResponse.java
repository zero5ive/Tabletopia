package com.tabletopia.restaurantservice.domain.restaurantFacility.dto;

import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 매장별 편의시설 정보를 응답 형태로 전달하기 위한 DTO
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Getter
@NoArgsConstructor
public class RestaurantFacilityResponse{

  private Long facilityId;
  private String facilityName;
  private String facilityInfo;
  private boolean active;

  /**
   * 엔티티를 DTO로 변환하는 생성자
   *
   * @param entity 매장 편의시설 엔티티
   */
  public RestaurantFacilityResponse(RestaurantFacility entity) {
    this.facilityId = entity.getFacility().getId();
    this.facilityName = entity.getFacility().getName();
    this.facilityInfo = entity.getFacilityInfo();
    this.active = entity.isActive();
  }
}
