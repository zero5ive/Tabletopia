package com.tabletopia.restaurantservice.domain.payment.service;

import com.tabletopia.restaurantservice.domain.payment.entity.PaymentDetail;
import com.tabletopia.restaurantservice.domain.payment.repository.JpaPaymentDetailRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class PaymentDetailService {
    private final JpaPaymentDetailRepository jpaPaymentDetailRepository;

    public void register(PaymentDetail paymentDetail){
        jpaPaymentDetailRepository.save(paymentDetail);
    }
}
