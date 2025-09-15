package com.tabletopia.app.service.payment;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.databind.node.ObjectNode;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.tabletopia.app.model.payment.PaymentRepository;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

/**
 * 토스 결제 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class PaymentService {

    private final String secretKey = "test_sk_zXLkKEypNArWmo50nX3lmeaxYG5R";
    private final String tossUrl = "https://api.tosspayments.com/v1/payments/confirm";

    private final ObjectMapper objectMapper;
    private final PaymentRepository paymentRepository;


    /**
     * 결제 관련 세션 정보 추출
     */
//    public PaymentSessionData extractPaymentSessionData(HttpSession httpSession) {
//        String postCode = (String) httpSession.getAttribute("postCode");
//        String address = (String) httpSession.getAttribute("address");
//        String detailAddress = (String) httpSession.getAttribute("detailAddress");
//        User user = (User) httpSession.getAttribute("user");
//        List<SnapShot> snapshotList = (List<SnapShot>) httpSession.getAttribute("cartSnapshots");
//
//        log.debug("주소 정보: {}, {}, {}, {}", postCode, address, detailAddress, user);
//
//        return new PaymentSessionData(postCode, address, detailAddress, snapshotList, user);
//    }

    /**
     * 결제 승인 요청 후 완료 처리
     * @param request
     * @param session
     * @param sessionData
     * @return
     */
    public TossConfirmResponse handlePaymentAndSession(ConfirmPaymentRequest request, HttpSession session, PaymentSessionData sessionData) {
        // 결제 승인 요청
        TossConfirmResponse response = confirmPayment(request.getPaymentKey(), request.getOrderId(), request.getAmount());

        // 결제 완료 처리
        OrderReceipt orderReceipt = processPaymentComplete(
                request, response, sessionData.getUser(),
                sessionData.getPostCode(), sessionData.getAddress(), sessionData.getDetailAddress(),
                sessionData.getSnapshotList()
        );

        // 세션 정리
        cleanupPaymentSession(session, orderReceipt.getOrder_receipt_id());

        return response;
    }

    /**
     * 결제 승인 후 완료 처리를 위한 데이터 insert
     */
    @Transactional
    public OrderReceipt processPaymentComplete(ConfirmPaymentRequest request,
                                               TossConfirmResponse tossResponse,
                                               User user,
                                               String postCode,
                                               String address,
                                               String detailAddress,
                                               List<SnapShot> snapshotList) {

        // 결제 정보 DB 저장
        Tosspayment tosspayment = insert(
                request.getOrderId(),
                request.getPaymentKey(),
                tossResponse.getMethod(),
                tossResponse.getStatus(),
                request.getAmount(),
                tossResponse.getApprovedAt().toLocalDateTime(),
                tossResponse.getRequestedAt().toLocalDateTime()
        );

        // OrderReceipt DB 저장
        OrderReceipt orderReceipt = orderReceiptService.insert(
                tossResponse.getApprovedAt().toLocalDateTime(),
                "상품 준비 전",
                user,
                tosspayment,
                postCode,
                address,
                detailAddress
        );

        // OrderDetail DB 저장
        for (SnapShot snapShot : snapshotList) {
            orderDetailService.insert(orderReceipt.getOrder_receipt_id(), snapShot.getSnapshot_id());
        }

        // 결제되었으므로 장바구니의 상품 삭제
        cartItemService.deleteAllByUserId(user.getUser_id());

        log.debug("결제 완료 처리 완료. OrderReceipt ID: {}", orderReceipt.getOrder_receipt_id());

        return orderReceipt;
    }

    /**
     * 결제 완료 후 세션 정리
     */
    public void cleanupPaymentSession(HttpSession httpSession, int orderReceiptId) {
        // 세션에서 정보 삭제
        httpSession.removeAttribute("postCode");
        httpSession.removeAttribute("address");
        httpSession.removeAttribute("detailAddress");
        httpSession.removeAttribute("cartSnapshots");

        // orderReceiptId 세션에 저장
        httpSession.setAttribute("orderReceiptId", orderReceiptId);

        log.debug("결제 관련 세션 정리 완료");
    }

    /**
     * 토스 결제 확정 API 호출 서비스 메서드
     *
     * @param paymentKey 토스 결제 키
     * @param orderId    주문 ID
     * @param amount     결제 금액
     * @return TossConfirmResponse 결제 확인 응답 DTO
     * @throws RuntimeException
     */
    public TossConfirmResponse confirmPayment(String paymentKey, String orderId, long amount) {
        log.debug("confirmPayment 진입");
        log.debug("paymentKey={}, orderId={}, amount={}", paymentKey, orderId, amount);

        // 최대 3번까지 재시도
        for (int attempt = 1; attempt <= 3; attempt++) {
            try {
                // ObjectMapper로 요청 JSON 객체 생성
                ObjectNode requestObj = objectMapper.createObjectNode();
                requestObj.put("paymentKey", paymentKey);
                requestObj.put("orderId", orderId);
                requestObj.put("amount", amount);

                String bodyJson = objectMapper.writeValueAsString(requestObj);

                // Basic Auth 헤더 생성
                String auth = secretKey + ":";
                String encodedAuth = Base64.getEncoder().encodeToString(auth.getBytes(StandardCharsets.US_ASCII));
                String authHeader = "Basic " + encodedAuth;

                log.debug("Toss Confirm 요청 URL: {}, 헤더 Authorization: {}, 요청 바디: {}", tossUrl, authHeader, bodyJson);

                OkHttpClient client = new OkHttpClient();
                okhttp3.RequestBody body = okhttp3.RequestBody.create(bodyJson, okhttp3.MediaType.get("application/json"));

                Request request = new Request.Builder()
                        .url(tossUrl)
                        .addHeader("Authorization", authHeader)
                        .addHeader("Content-Type", "application/json")
                        .post(body)
                        .build();

                try (Response response = client.newCall(request).execute()) {
                    int statusCode = response.code();
                    String responseBody = response.body() != null ? response.body().string() : "";

                    log.debug("OkHttp confirm status: {}, body: {}", statusCode, responseBody);

                    if (statusCode == 200) {
                        return objectMapper.readValue(responseBody, TossConfirmResponse.class);
                    } else if (statusCode >= 500 && attempt < 3) {
                        log.warn("Toss 서버 오류 ({}), {}번째 재시도 중...", statusCode, attempt);
                        Thread.sleep(1000); // 1초 쉬고 재시도
                        continue;
                    } else {
                        throw new RuntimeException("Toss Confirm API 호출 실패 " + statusCode);
                    }
                }
            } catch (IOException e) {
                log.error("OkHttp 요청 중 IOException 발생", e);
                if (attempt >= 3) {
                    throw new RuntimeException("Toss Confirm API 호출 중 오류 발생", e);
                }
                log.warn("IOException 발생으로 재시도 시도 중... ({}번째)", attempt);
                try {
                    Thread.sleep(1000);
                } catch (InterruptedException ignored) {}
            } catch (Exception e) {
                log.error("Toss Confirm 처리 중 예외 발생", e);
                throw new RuntimeException("Toss Confirm 처리 실패", e);
            }
        }

        throw new RuntimeException("Toss Confirm API 호출 재시도 실패");
    }

    /**
     * 토스에 결제 승인받기
     *
     * @param confirmPaymentRequest
     * @return
     * @throws Exception
     */
    private String getAuthorizations() {
        log.debug("getAuthorizations");
        String auth = secretKey + ":";
        return "Basic " + Base64.getEncoder().encodeToString(auth.getBytes());
    }

    /**
     * 결제 정보 데이터베이스에 추가
     *
     * @param tossOrderId
     * @param tossPaymentKey
     * @param tossPaymentMethod
     * @param tossPaymentStatus
     * @param totalAmount
     * @param ApprovedAt
     * @param requestedAt
     * @return
     */
    public Tosspayment insert(String tossOrderId, String tossPaymentKey, String tossPaymentMethod,
                              String tossPaymentStatus, long totalAmount, LocalDateTime ApprovedAt, LocalDateTime requestedAt) {
        Tosspayment tosspayment = new Tosspayment();
        tosspayment.setTossOrderId(tossOrderId);
        tosspayment.setTossPaymentKey(tossPaymentKey);
        tosspayment.setTossPaymentMethod(tossPaymentMethod);
        tosspayment.setTossPaymentStatus(tossPaymentStatus);
        tosspayment.setTotalAmount(totalAmount);
        tosspayment.setApprovedAt(ApprovedAt);
        tosspayment.setRequestedAt(requestedAt);

        return tosspaymentDAO.insert(tosspayment);
    }




    /**
     * 결제 취소 요청
     */
    public String cancelPayment(String paymentKey, String cancelReason) throws IOException {
        log.debug("cancelPayment");
        String cancelUrl = "https://api.tosspayments.com/v1/payments/" + paymentKey + "/cancel";

        // JSON 본문 구성
        String requestBody = "{\"cancelReason\": \"" + cancelReason + "\"}";

        HttpPost post = new HttpPost(cancelUrl);
        post.setHeader("Authorization", getAuthorizations());
        post.setHeader("Content-Type", "application/json");
        post.setEntity(new StringEntity(requestBody, "UTF-8"));

        try (CloseableHttpClient client = HttpClients.createDefault();
             CloseableHttpResponse response = client.execute(post)) {

            String responseBody = EntityUtils.toString(response.getEntity(), "UTF-8");
            return responseBody;
        }
    }
}