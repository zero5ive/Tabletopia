package com.tabletopia.realtimeservice.domain.reservation.dto;

import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 테이블 예약 접속용 메시지
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Data
@NoArgsConstructor
public class ConnectionMessage {
  private String userEmail;
  private String userName;
}
