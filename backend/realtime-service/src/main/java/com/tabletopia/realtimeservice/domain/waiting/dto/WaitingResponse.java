package com.tabletopia.realtimeservice.domain.waiting.dto;

import com.tabletopia.realtimeservice.domain.waiting.enums.WaitingState;
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
}
