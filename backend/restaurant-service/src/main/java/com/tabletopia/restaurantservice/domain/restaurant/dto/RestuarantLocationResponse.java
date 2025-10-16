package com.tabletopia.restaurantservice.domain.restaurant.dto;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 레스토랑 디티오
 *
 * @author 성유진
 * @since 2025-10-16
 */
@Data
@Builder
public class RestuarantLocationResponse {

  private BigDecimal latitude;
  private BigDecimal longitude;

  public static RestuarantLocationResponse from(Restaurant restaurant) {
    return RestuarantLocationResponse.builder()
        .latitude(restaurant.getLatitude())
        .longitude(restaurant.getLongitude())
        .build();
  }
}
