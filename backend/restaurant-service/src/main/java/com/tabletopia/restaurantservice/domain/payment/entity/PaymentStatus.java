package com.tabletopia.restaurantservice.domain.payment.entity;

/**
 * java.lang.Enum을 상속한 클래스
 * 여기서는 PaymentDetail의 status를 관리하기 위해 생성 되었다.
 *
 * @author 이세형
 * @since 2025-10-18
 * */
public enum PaymentStatus {
    READY,
    SUCCESS,
    FAIL,
    CANCEL
}
