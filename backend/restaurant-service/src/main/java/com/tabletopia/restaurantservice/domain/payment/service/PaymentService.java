package com.tabletopia.restaurantservice.domain.payment.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.tabletopia.restaurantservice.domain.payment.dto.PaymentRequestDTO;
import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.payment.repository.PaymentRepository;
import com.tabletopia.restaurantservice.domain.reservation.service.ReservationService;
import com.tabletopia.restaurantservice.domain.reservation.service.TableSelectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class PaymentService {
    private final PaymentRepository paymentRepository;

    @Value("${payment.frontend.url:http://localhost:3000}")
    private String frontendUrl;

    /**
     * 결제요청을 보내고 ok를 받아오는 메서드
     *
     * @author 이세형
     * @since 2025-10-19
     * */
    public ResponseEntity<String> paymentRequest(PaymentRequestDTO payment) {
        try {
            RestTemplate restTemplate = new RestTemplate();

            JSONObject jsonBody = new JSONObject();
            jsonBody.put("amount", payment.getAmount());
            jsonBody.put("amountTaxFree", payment.getAmountTaxFree());
            jsonBody.put("productDesc", payment.getProductDesc());
            jsonBody.put("orderNo", payment.getOrderNo());
            jsonBody.put("apiKey", "sk_test_w5lNQylNqa5lNQe013Nq");
            jsonBody.put("autoExecute", true);
            jsonBody.put("resultCallback", "https://pay.toss.im/payfront/demo/callback");
            jsonBody.put("retUrl", frontendUrl + "/reservations/payment/success");
            jsonBody.put("retCancelUrl", frontendUrl + "/reservations/payment/cancel");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody.toJSONString(), headers);

            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://pay.toss.im/api/v2/payments",
                    requestEntity,
                    String.class
            );

            log.debug("응답 코드: {}", response.getStatusCode());
            log.debug("응답 바디: {}", response.getBody());

            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());

        } catch (Exception e) {
            log.error("결제 요청 중 오류 발생", e);

            // 에러 응답 JSON 형식으로 반환
            JSONObject errorResponse = new JSONObject();
            errorResponse.put("success", false);
            errorResponse.put("message", "결제 요청 중 오류가 발생했습니다.");
            errorResponse.put("error", e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(errorResponse.toJSONString());
        }
    }




    /**
     * 결제 정보 생성 및 저장
     *
     * @param paymentRequestDTO 결제요청정보
     * @author 이세형
     * @since 2025-10-18
     */
    public Payment createPayment(PaymentRequestDTO paymentRequestDTO) {
        Payment payment = Payment.from(paymentRequestDTO);
        // payment insert
        return paymentRepository.save(payment);
    }


    /**
     * 토스 응답에서 checkoutPage URL 추출
     *
     * @param responseBody 토스 API 응답 본문
     * @return checkoutPage URL
     * @author Claude Code
     * @since 2025-10-19
     */
    public String extractCheckoutPage(String responseBody) {
        try {
            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode jsonNode = objectMapper.readTree(responseBody);

            // checkoutPage 필드 추출
            if (jsonNode.has("checkoutPage")) {
                return jsonNode.get("checkoutPage").asText();
            }

            log.warn("checkoutPage가 응답에 없습니다. 전체 응답: {}", responseBody);
            throw new RuntimeException("결제 페이지 URL을 찾을 수 없습니다.");

        } catch (Exception e) {
            log.error("checkoutPage 추출 중 오류 발생", e);
            throw new RuntimeException("결제 페이지 URL 추출 실패: " + e.getMessage());
        }
    }

    /**
     * 주문번호 생성
     *
     * @param reservationId 예약 ID
     * @return 생성된 주문번호
     * @author 이세형
     * @since 2025-10-18
     */
    private String generateOrderNo(Long reservationId) {
        return "TT-" + reservationId + "-" + UUID.randomUUID().toString().substring(0, 8);
    }

}
