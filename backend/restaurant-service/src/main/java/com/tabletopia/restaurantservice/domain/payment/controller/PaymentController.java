package com.tabletopia.restaurantservice.domain.payment.controller;

import com.tabletopia.restaurantservice.domain.payment.dto.PaymentSuccessDTO;
import com.tabletopia.restaurantservice.domain.payment.dto.PaymentDetailDTO;
import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.payment.service.PaymentDetailService;
import com.tabletopia.restaurantservice.domain.payment.entity.PaymentDetail;
import com.tabletopia.restaurantservice.domain.payment.entity.PaymentStatus;
import com.tabletopia.restaurantservice.domain.reservation.entity.Reservation;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import net.minidev.json.JSONObject;
import net.minidev.json.parser.JSONParser;
import org.springframework.http.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
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

    private final PaymentDetailService paymentDetailService;

    @Transactional
    @PostMapping
    public ResponseEntity<String> test(@RequestBody Payment payment) {

        log.debug("결제 컨트롤러에 진입했습니다.");

        try {

            // orderNo를 난수로 생성하는 로직
            String orderNo = java.util.UUID.randomUUID().toString();
            if (orderNo.length() > 50) {
                orderNo = orderNo.substring(0, 50);
            }

            // RestTemplate 인스턴스 생성
            RestTemplate restTemplate = new RestTemplate();

            // 요청 바디(JSON) 구성
            JSONObject jsonBody = new JSONObject();
            //받아와서 담아줘야 하는 value들
            jsonBody.put("amount", payment.getAmount());
            jsonBody.put("amountTaxFree", payment.getAmountTaxFree());
            jsonBody.put("productDesc", payment.getProductDesc());

            //프론트에서 받아오지 않아도 되는 value들 (내부에서 값 할당)
            //put의 특성상 key, value값이 원래 있던 JSON에 추가되어서 들어옴
            jsonBody.put("orderNo", orderNo); //보안을 위해 백엔드에서 처리
            jsonBody.put("apiKey", "sk_test_w5lNQylNqa5lNQe013Nq");
            jsonBody.put("autoExecute", true);
            jsonBody.put("resultCallback", "https://pay.toss.im/payfront/demo/callback");

            //결제완료 후 요청을 받을 주소
            jsonBody.put("retUrl", "http://localhost:3000/reservations/payment/success");

            jsonBody.put("retCancelUrl", "https://pay.toss.im/payfront/demo/cancel");

//            https://pay.toss.im/payfront/web/login

            // HTTP 헤더 설정
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // 요청 엔티티 생성 (헤더 + 바디)
            HttpEntity<String> requestEntity = new HttpEntity<>(jsonBody.toJSONString(), headers);

            // POST 요청 전송
            ResponseEntity<String> response = restTemplate.postForEntity(
                    "https://pay.toss.im/api/v2/payments",
                    requestEntity,
                    String.class
            );

            // 응답 코드 및 본문 로그 출력
            log.debug("응답 코드: {}", response.getStatusCode());
            log.debug("응답 바디: {}", response.getBody());
            log.debug("응답 객체 : {}", response);

//            if (response.getStatusCode() == HttpStatus.OK) {
//                try {
//                    // JSON 파싱
//                    JSONParser parser = new JSONParser();
//                    JSONObject responseBody = (JSONObject) parser.parse(response.getBody());
//                    JSONObject card = (JSONObject) responseBody.get("card");
//
//
//                    // TODO: reservation 객체를 어떻게 가져올지 결정해야 합니다.
//                    //  PaymentDetail의 reservation은 필수 값입니다.
//                    Reservation reservation = new Reservation();
//
//
//                    PaymentDetail paymentDetail = new PaymentDetail();
//                    paymentDetail.setOrderNo(orderNo);
//                    paymentDetail.setAmount(new BigDecimal(payment.getAmount()));
//                    paymentDetail.setPayMethod(card.get("company").toString()); // TODO: Toss API 응답 필드 확인 필요
//                    paymentDetail.setPgTid(responseBody.get("paymentKey").toString()); // TODO: Toss API 응답 필드 확인 필요
//                    paymentDetail.setStatus(PaymentStatus.SUCCESS); // TODO: Toss API 응답에 따라 상태 설정
//                    paymentDetail.setReservation(reservation); // TODO: 실제 Reservation 객체로 설정해야 합니다.
//
//                    String approvedAtStr = responseBody.get("approvedAt").toString(); // TODO: Toss API 응답 필드 확인 필요
//                    DateTimeFormatter formatter = DateTimeFormatter.ISO_OFFSET_DATE_TIME;
//                    LocalDateTime approvedAt = LocalDateTime.parse(approvedAtStr, formatter);
//                    paymentDetail.setApprovedAt(approvedAt);
//
//
//                    paymentDetailService.register(paymentDetail);
//                } catch (Exception e) {
//                    log.error("결제 정보 저장 중 오류 발생", e);
//                    // TODO: 결제 정보 저장 실패 시 처리 로직 추가 (예: 결제 취소 API 호출)
//                }
//            }

            return ResponseEntity.ok(response.getBody());

        } catch (Exception e) {
            log.error("결제 요청 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("결제 요청 실패: " + e.getMessage());
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
