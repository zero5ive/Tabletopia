package com.tabletopia.restaurantservice.domain.payment.controller;

import com.tabletopia.restaurantservice.domain.payment.dto.PaymentRequestDTO;
import com.tabletopia.restaurantservice.domain.payment.dto.PaymentSuccessDTO;
import com.tabletopia.restaurantservice.domain.payment.dto.ReservationPaymentRequestDTO;
import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.payment.service.PaymentService;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationFacadeService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

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
    private final ReservationFacadeService reservationFacadeService;

    // 임시 저장소 (orderNo -> ReservationPaymentRequestDTO)
    // TODO: 추후 Redis로 교체 필요
    private static final Map<String, ReservationPaymentRequestDTO> pendingPayments = new ConcurrentHashMap<>();

    @PostMapping
    public ResponseEntity<Map<String, Object>> pay(
            @RequestBody ReservationPaymentRequestDTO paymentRequest,
            Principal principal) {
        log.debug("결제 페이지 요청 - 컨트롤러 진입");

        try {
            // 결제 요청에 필요한 orderNo 생성
            String orderNo = java.util.UUID.randomUUID().toString();
            if (orderNo.length() > 50) {
                orderNo = orderNo.substring(0, 50);
            }
            // orderNo 대입
            paymentRequest.getPaymentRequestDTO().setOrderNo(orderNo);

            // 예약 정보를 임시 저장 (orderNo를 키로 사용)
            pendingPayments.put(orderNo, paymentRequest);
            log.debug("주문번호: {}, 예약정보 임시 저장 완료", orderNo);

            // ================== 토스 결제 페이지 요청 ====================
            PaymentRequestDTO paymentRequestDTO = paymentRequest.getPaymentRequestDTO();
            ResponseEntity<String> paymentResponse = paymentService.paymentRequest(paymentRequestDTO);

            if (paymentResponse.getStatusCode().is2xxSuccessful()) {
                // 토스 응답에서 checkoutPage URL 추출하여 반환
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("checkoutPage", paymentService.extractCheckoutPage(paymentResponse.getBody()));
                response.put("orderNo", orderNo);

                log.debug("결제 페이지 URL 반환: {}", response.get("checkoutPage"));
                return ResponseEntity.ok(response);
            } else {
                Map<String, Object> response = new HashMap<>();
                response.put("success", false);
                response.put("message", "결제 페이지 생성에 실패했습니다.");

                return ResponseEntity.ok(response);
            }
        } catch (Exception e) {
            log.error("결제 페이지 요청 중 오류 발생", e);
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "결제 페이지 생성 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /**
     * 결제 완료 후 최종 승인 및 예약 등록
     *
     * @author 이세형, Claude Code
     * @since 2025-10-18
     * */
    @Transactional
    @PostMapping("/confirm")
    public ResponseEntity<Map<String, Object>> paymentConfirm(
            @RequestBody Map<String, Object> requestBody,
            Principal principal) {
        log.debug("결제 확인 메서드 진입: {}", requestBody);

        try {
            // paymentConfirm 객체 추출
            @SuppressWarnings("unchecked")
            Map<String, String> paymentConfirm = (Map<String, String>) requestBody.get("paymentConfirm");

            if (paymentConfirm == null) {
                throw new IllegalArgumentException("결제 확인 정보가 없습니다.");
            }

            String status = paymentConfirm.get("status");
            String orderNo = paymentConfirm.get("orderNo");
            String payMethod = paymentConfirm.get("payMethod");

            log.debug("결제 상태: {}, 주문번호: {}, 결제수단: {}", status, orderNo, payMethod);

            // 결제 성공 여부 확인 (토스는 PAY_COMPLETE 상태를 반환)
            if (!"PAY_COMPLETE".equals(status)) {
                throw new IllegalStateException("결제가 완료되지 않았습니다. 상태: " + status);
            }

            // 임시 저장소에서 예약 정보 조회 및 제거 (원자적 연산으로 중복 방지)
            ReservationPaymentRequestDTO paymentRequest = pendingPayments.remove(orderNo);
            if (paymentRequest == null) {
                log.warn("주문번호 {}에 대한 예약 정보를 찾을 수 없습니다. (이미 처리되었거나 존재하지 않음)", orderNo);

                // 이미 처리된 경우 성공 응답 반환
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("message", "이미 처리된 결제입니다.");
                return ResponseEntity.ok(response);
            }

            // ================== DB 저장 ====================
            // 1. 결제 정보 저장
            PaymentRequestDTO paymentRequestDTO = paymentRequest.getPaymentRequestDTO();
            Payment payment = paymentService.createPayment(paymentRequestDTO);
            log.debug("결제 정보 저장 완료: paymentId={}", payment.getId());

            // 2. 예약 정보 저장 (payment 객체 포함)
            ReservationRequest reservationRequest = paymentRequest.getReservationRequest();
            Map<String, Object> reservationResult = reservationFacadeService.registerReservationWithPayment(
                    reservationRequest, payment, principal);

            log.debug("예약 정보 저장 결과: {}", reservationResult);

            // 3. 임시 저장소에서 이미 제거됨 (124번째 줄에서 remove 사용)
            log.debug("결제 및 예약 처리 완료: orderNo={}", orderNo);

            // 성공 응답
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "TableTopia 예약 서비스를 이용해 주셔서 감사합니다.");
            response.put("paymentId", payment.getId());
            response.put("reservationResult", reservationResult);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("결제 확인 처리 중 오류 발생", e);

            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "결제 확인 중 오류가 발생했습니다: " + e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

}
