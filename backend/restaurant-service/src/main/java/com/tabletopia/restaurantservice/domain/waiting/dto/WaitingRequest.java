package com.tabletopia.restaurantservice.domain.waiting.dto;

import lombok.Data;

/**
 * 웨이팅 디티오
 *
 * @author 성유진
 * @since 2025-10-01
 */

@Data
public class WaitingRequest {

  private Long userId;
  private String restaurantName;
  private Integer peopleCount;
  private Long restaurantId;



}
