package com.tabletopia.restaurantservice.domain.reservation.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 개인 세션 정보 응답 DTO
 *
 * @author 김예진
 * @since 2025-10-11
 */
@Getter
@Setter
@NoArgsConstructor
public class SessionInfoResponse {
  /**
   * 메시지 타입
   */
  private String type = "SESSION_INFO";

  /**
   * 사용자의 세션 ID
   */
  private String mySessionId;

  /**
   * 전송 시각
   */
  private Long timestamp;

  /**
   * 정적 팩토리 메서드
   *
   * @param mySessionId 사용자의 세션 ID
   * @return SessionInfoResponse 인스턴스
   */
  public static SessionInfoResponse of(String mySessionId) {
    SessionInfoResponse response = new SessionInfoResponse();
    response.mySessionId = mySessionId;
    response.timestamp = System.currentTimeMillis();
    return response;
  }
}
