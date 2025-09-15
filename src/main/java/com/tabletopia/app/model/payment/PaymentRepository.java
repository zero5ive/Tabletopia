package com.tabletopia.app.model.payment;

import com.tabletopia.app.domain.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

}
