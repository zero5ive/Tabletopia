package com.tabletopia.restaurantservice.domain.waiting.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 웨이팅 상태 조회 응답 DTO
 *
 * @author 성유진
 * @since 2025-12-15
 */
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class WaitingStatusResponse {

  /**
   * 웨이팅 오픈 여부
   */
  @JsonProperty("isOpen")
  private boolean isOpen;

  /**
   * 2인석 대기 팀 수
   */
  private long team2;

  /**
   * 4인석 대기 팀 수
   */
  private long team4;

  /**
   * 정적 팩토리 메서드
   */
  public static WaitingStatusResponse of(boolean isOpen, long team2, long team4) {
    return new WaitingStatusResponse(isOpen, team2, team4);
  }
}
