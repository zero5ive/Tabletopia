package com.tabletopia.restaurantservice.domain.reservation.service;

import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.Map;

/**
 * 예약 관련 파사드 서비스
 * TableSelectionService와 ReservationService 간의 순환 참조를 해결하기 위해 생성
 *
 * @author Claude Code
 * @since 2025-10-19
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ReservationFacadeService {

    private final ReservationService reservationService;

    /**
     * 결제요청시 필요한 ReservationRequest객체를 전달해 주기 위한 메서드
     *
     * @author 이세형
     * @since 2025-10-19
     */
    public ReservationRequest sendReservationInfo(ReservationRequest reservationRequest) {
        return reservationRequest;
    }

    /**
     * 예약 등록 (검증 포함)
     *
     * @param reservationRequest 예약 요청 정보
     * @param principal          JWT 인증 정보
     * @return 예약 결과 (success, reservationId, message)
     * @author 김예진, 이세형
     * @since 2025-10-19
     */
    public Map<String, Object> registerReservation(ReservationRequest reservationRequest, Principal principal) {

        try {
            // JWT에서 추출된 인증된 사용자 이메일
            String authenticatedEmail = null;

            if (principal != null) {
                authenticatedEmail = principal.getName(); // JWT에서 추출된 이메일
                log.debug("Principal에서 추출한 이메일: {}", authenticatedEmail);
            } else {
                // Principal이 null인 경우, 요청 본문의 customerInfo에서 이메일 추출 (임시)
                if (reservationRequest.getCustomerInfo() != null && reservationRequest.getCustomerInfo().getEmail() != null) {
                    authenticatedEmail = reservationRequest.getCustomerInfo().getEmail();
                    log.debug("요청 본문에서 추출한 이메일: {}", authenticatedEmail);
                }
            }

            if (authenticatedEmail == null) {
                log.warn("인증 정보 없음: 예약 등록 실패");
                return Map.of(
                        "success", false,
                        "message", "인증되지 않은 사용자입니다. 로그인 후 다시 시도해주세요."
                );
            }

            // Service에서 검증 및 예약 등록 처리
            Long reservationId = reservationService.createReservationWithValidation(reservationRequest,
                    authenticatedEmail);

            log.debug("예약 등록 성공: ID={}, 사용자={}", reservationId, authenticatedEmail);
            return Map.of(
                    "success", true,
                    "reservationId", reservationId,
                    "message", "예약이 성공적으로 등록되었습니다."
            );
        } catch (IllegalStateException e) {
            // 검증 실패 (비즈니스 로직 에러)
            log.warn("예약 검증 실패: {}", e.getMessage());
            return Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
        } catch (Exception e) {
            // 시스템 에러
            log.error("예약 등록 중 예상치 못한 오류 발생", e);
            return Map.of(
                    "success", false,
                    "message", "예약 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
        }
    }

    /**
     * 결제 완료 후 예약 등록 (Payment 객체 포함)
     *
     * @param reservationRequest 예약 요청 정보
     * @param payment           결제 정보
     * @param principal         JWT 인증 정보
     * @return 예약 결과 (success, reservationId, message)
     * @author Claude Code
     * @since 2025-10-19
     */
    public Map<String, Object> registerReservationWithPayment(
            ReservationRequest reservationRequest,
            Payment payment,
            Principal principal) {

        try {
            // JWT에서 추출된 인증된 사용자 이메일
            String authenticatedEmail = null;

            if (principal != null) {
                authenticatedEmail = principal.getName();
                log.debug("Principal에서 추출한 이메일: {}", authenticatedEmail);
            } else {
                if (reservationRequest.getCustomerInfo() != null &&
                        reservationRequest.getCustomerInfo().getEmail() != null) {
                    authenticatedEmail = reservationRequest.getCustomerInfo().getEmail();
                    log.debug("요청 본문에서 추출한 이메일: {}", authenticatedEmail);
                }
            }

            if (authenticatedEmail == null) {
                log.warn("인증 정보 없음: 예약 등록 실패");
                return Map.of(
                        "success", false,
                        "message", "인증되지 않은 사용자입니다. 로그인 후 다시 시도해주세요."
                );
            }

            // Service에서 검증 및 예약 등록 처리 (Payment 포함)
            Long reservationId = reservationService.createReservationWithPayment(
                    reservationRequest, payment, authenticatedEmail);

            log.debug("예약 등록 성공: ID={}, 사용자={}, paymentId={}", reservationId, authenticatedEmail, payment.getId());
            return Map.of(
                    "success", true,
                    "reservationId", reservationId,
                    "message", "예약이 성공적으로 등록되었습니다."
            );
        } catch (IllegalStateException e) {
            log.warn("예약 검증 실패: {}", e.getMessage());
            return Map.of(
                    "success", false,
                    "message", e.getMessage()
            );
        } catch (Exception e) {
            log.error("예약 등록 중 예상치 못한 오류 발생", e);
            return Map.of(
                    "success", false,
                    "message", "예약 등록 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요."
            );
        }
    }
}
