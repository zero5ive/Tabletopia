package com.tabletopia.restaurantservice.domain.payment.dto;

import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import lombok.Data;

@Data
public class ReservationPaymentRequestDTO {
    // 결제 요청 정보 DTO
    private PaymentRequestDTO paymentRequestDTO;

    // 예약 요청 정보 DTO
    private ReservationRequest reservationRequest;
}
