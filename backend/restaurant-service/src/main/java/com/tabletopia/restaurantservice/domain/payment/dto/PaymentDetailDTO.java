package com.tabletopia.restaurantservice.domain.payment.dto;

import lombok.Data;

@Data
public class PaymentDetailDTO {
    String apiKey;
    String orderNo;
    String productDesc;
    String retUrl;
    String retCancelUrl;
    int amount;
    int amountTaxFree;
    private Long reservationId;
}
