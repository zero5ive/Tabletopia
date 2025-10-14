package com.tabletopia.restaurantservice.domain.reservation.enums;

public enum TableSelectStatus {
  AVAILABLE, // 누구나 예약 시도 가능
  PENDING, // 결제 대기 상태
  CONFIRMED, // 예약 완료
  CANCELLED // 만료 또는 예약 취소됨
}
