package com.tabletopia.restaurantservice.domain.waiting.dto;

import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import java.time.LocalDateTime;
import lombok.Data;

/**
 * 웨이팅 디티오
 *
 * @author 성유진
 * @since 2025-10-09
 */

@Data
public class WaitingResponse {

  private Long id;
  private Integer waitingNumber;
  private Long userId;
  private String userName;
  private String userPhone;
  private Integer peopleCount;
  private WaitingState waitingState; // WAITING, SEATED, CANCELLED, CALLED, EXPIRED
  private Long restaurantId;
  private String restaurantName;
  private LocalDateTime createdAt; // 등록 시간

  private String waitingTime; // "15분 대기" 같은 계산된 값

  public static WaitingResponse from(Waiting waiting, Long restaurantId) {
    WaitingResponse response = new WaitingResponse();

    response.setRestaurantId(restaurantId);
    response.setRestaurantName(waiting.getRestaurantNameSnapshot());
    response.setCreatedAt(LocalDateTime.now());
    response.setWaitingNumber(waiting.getWaitingNumber());
    response.setPeopleCount(waiting.getPeopleCount());
    response.setUserId(waiting.getUserId());
    response.setWaitingState(waiting.getWaitingState());

    return response;
  }

}
