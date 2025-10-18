package com.tabletopia.restaurantservice.domain.waiting.dto;

import java.time.LocalDateTime;
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
  private String senderName; //발신자 이름
  private String tel;  //발신자 전화번호

  private Long waitingId;
  private Long restaurantId;
  private String adminName;
  private LocalDateTime timestamp;



}
