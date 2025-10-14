package com.tabletopia.restaurantservice.domain.waiting.dto;

import lombok.Data;

/**
 * 웨이팅 디티오
 *
 * @author 성유진
 * @since 2025-09-26
 */

@Data
public class WaitingEvent {

  private String type;   // 알림 종류: "NEW_WAITING", "CANCEL", "CALL" 등
  private Long sender; // 발신자: 관리자 id,
  private String content; // 메시지 내용


}
