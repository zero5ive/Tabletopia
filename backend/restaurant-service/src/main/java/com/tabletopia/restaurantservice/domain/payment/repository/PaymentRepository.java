package com.tabletopia.restaurantservice.domain.payment.repository;

import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * DB의 payment 테이블에 쿼리문을 명령하는 인터페이스 입니다.
 *
 * @author 이세형
 * @since 2025-10-18
 * */
public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
