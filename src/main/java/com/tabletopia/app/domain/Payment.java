package com.tabletopia.app.domain;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter @Setter
public class Payment {
    private Long paymentId;

    private String tossPaymentKey;

    private String tossOrderId;

    private long totalAmount;

    private String tossPaymentMethod;

    private String tossPaymentStatus;

    private LocalDateTime requestedAt;

    private LocalDateTime approvedAt;
}
