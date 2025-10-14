package com.tabletopia.restaurantservice.domain.reservation.dto;

import com.tabletopia.restaurantservice.domain.reservation.enums.TableSelectStatus;
import java.io.Serializable;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 테이블 선점 정보
 *
 * @author 김예진
 * @since 2025-09-29
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TableSelectionInfo implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * 테이블 ID
   */
  private Long tableId;

  /**
   * 선점한 사용자의 세션 ID
   */
  private String sessionId;

  /**
   * 선점 시작 시간
   */
  private LocalDateTime selectedAt;

  /**
   * 선점 만료 시간 (5분 후)
   */
  private LocalDateTime expiryTime;

  /**
   * 선점 상태 (PENDING, CONFIRMED 등)
   */
  private TableSelectStatus status;
}
