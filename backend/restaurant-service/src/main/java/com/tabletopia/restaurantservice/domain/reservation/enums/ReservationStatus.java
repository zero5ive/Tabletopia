package com.tabletopia.restaurantservice.domain.reservation.enums;

public enum ReservationStatus {
    PENDING,    // 대기중
    CONFIRMED,  // 확정
    COMPLETED,  // 완료
    CANCELLED,  // 취소
    NO_SHOW     // 노쇼
}
