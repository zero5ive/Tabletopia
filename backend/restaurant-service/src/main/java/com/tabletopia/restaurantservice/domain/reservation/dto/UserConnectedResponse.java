package com.tabletopia.restaurantservice.domain.reservation.dto;

import java.util.Set;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 사용자 접속 알림 응답 DTO
 *
 * @author 김예진
 * @since 2025-10-11
 */
@Getter
@Setter
@NoArgsConstructor
public class UserConnectedResponse {
  /**
   * 메시지 타입
   */
  private String type = "USER_CONNECTED";

  /**
   * 새로 접속한 사용자 세션 ID
   */
  private String newUser;

  /**
   * 현재 접속 중인 모든 사용자 목록
   */
  private Set<String> connectedUsers;

  /**
   * 총 접속자 수
   */
  private Integer totalCount;

  /**
   * 전송 시각
   */
  private Long timestamp;

  /**
   * 정적 팩토리 메서드
   *
   * @param newUser 새로 접속한 사용자 세션 ID
   * @param connectedUsers 현재 접속 중인 모든 사용자 목록
   * @return UserConnectedResponse 인스턴스
   */
  public static UserConnectedResponse of(String newUser, Set<String> connectedUsers) {
    UserConnectedResponse response = new UserConnectedResponse();
    response.newUser = newUser;
    response.connectedUsers = connectedUsers;
    response.totalCount = connectedUsers != null ? connectedUsers.size() : 0;
    response.timestamp = System.currentTimeMillis();
    return response;
  }
}
