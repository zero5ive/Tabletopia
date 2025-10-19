package com.tabletopia.restaurantservice.domain.payment.dto;

import lombok.Data;

@Data
public class PaymentRequestDTO {
    String apiKey;
    String orderNo;
    String productDesc;
    String retUrl;
    String retCancelUrl;
    int amount;
    int amountTaxFree;
    // 요청에 포함되어 있지만 필수는 아닌 변수들 백엔드에서만 매핑해 줄것이므로 프론트에서 받아올 필요가 없음
//    boolean autoExecute;
//    String resultCallback;
}
