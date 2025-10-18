package com.tabletopia.restaurantservice.domain.payment.dto;

import lombok.Data;

/**
 * 결제에 성공한 이후 결제성공 안내 응답을 받고나면 검증 후 요청이 완료 되었음을 프론트에 보내주는 메서드
 * 결제성공 여부를 담아 결제성공메서드에 인증받기 위한 메서드
 *
 * @author 이세형
 * @since 2025-10-18
 * */
@Data
public class PaymentSuccessDTO {
    String status;
    String orderNo;
    String ayMethod;

}
