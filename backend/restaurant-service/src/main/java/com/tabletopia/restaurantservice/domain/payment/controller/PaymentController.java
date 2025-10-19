package com.tabletopia.restaurantservice.domain.payment.controller;

import com.tabletopia.restaurantservice.domain.payment.dto.PaymentRequestDTO;
import com.tabletopia.restaurantservice.domain.payment.dto.PaymentSuccessDTO;
import com.tabletopia.restaurantservice.domain.payment.dto.ReservationPaymentRequestDTO;
import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.payment.service.PaymentService;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.reservation.service.TableSelectionService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;

/**
 * 결제 요청을 처리하는 컨트롤러
 *
 * @author 이세형
 * @since 2025-10-18
 * */
@RestController
@RequestMapping("/api/user/payment")
@Slf4j
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;
    private final TableSelectionService tableSelectionService;

    @Transactional
    @PostMapping
    public ResponseEntity<Map<String, Object>> pay(
            @RequestBody ReservationPaymentRequestDTO paymentRequest,
            Principal principal) {
        log.debug("결제 컨트롤러에 진입했습니다.");

        // 결제 요청에 필요한 orderNo 생성
        String orderNo = java.util.UUID.randomUUID().toString();
        if (orderNo.length() > 50) {
            orderNo = orderNo.substring(0, 50);
        }
        // orderNo 대입
        paymentRequest.getPaymentRequestDTO().setOrderNo(orderNo);

        // ================== 결제 로직 ====================
        // 결제 요청용 DTO 추출
        PaymentRequestDTO paymentRequestDTO = paymentRequest.getPaymentRequestDTO();
        // 결제 요청
        ResponseEntity<String> paymentResponse = paymentService.paymentRequest(paymentRequestDTO);

        if (paymentResponse.getStatusCode().is2xxSuccessful()) {
            // 결제가 성공하였으므로 DB에 INSERT
            // 결제 정보 insert
            Payment payment = paymentService.createPayment(paymentRequestDTO);

            // 예약 정보 DTO 추출
            ReservationRequest reservationRequest = paymentRequest.getReservationRequest();
            // 예약 정보 insert
            Map<String, Object> reservation = tableSelectionService.registerReservation(reservationRequest, principal);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "TableTopia 예약 서비스를 이용해 주셔서 감사합니다.");

            return ResponseEntity.ok(response);
        } else {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "결제에 실패헀습니다.");

            return ResponseEntity.ok(response);
        }
    }

    /**
     * 결제에 성공한 이후 결제성공 안내 응답을 받고나면 검증 후 요청이 완료 되었음을 프론트에 보내주는 메서드
     *
     * @author 이세형
     * @since 2025-10-18
     * */
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> paymentConfirm(@RequestBody PaymentSuccessDTO paymentSuccessDTO) {
        log.debug("결제성공 메서드에 진입: {}", paymentSuccessDTO);

        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "TableTopia 예약 서비스를 이용해 주셔서 감사합니다.");

        return ResponseEntity.ok(response); // 200 OK
    }

}
