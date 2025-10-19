package com.tabletopia.restaurantservice.domain.payment.entity;

import com.tabletopia.restaurantservice.domain.payment.dto.PaymentRequestDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 결제정보를 DB에 저장하기 위한 Entity
 *
 * @author 이세형
 * @since 2025-10-18
 */
@Data
@NoArgsConstructor
@Entity
@Table(name = "payment",
        indexes = {
                @Index(name = "idx_payment_order_no", columnList = "order_no"),
                @Index(name = "idx_payment_status", columnList = "status")
        })
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** 주문번호 (PG/내부 공통 식별자) */
    @Column(name = "order_no", nullable = false, length = 100)
    private String orderNo;

//    /** 결제 고유 ID (PG사에서 내려주는 경우 존재) */
//    @Column(name = "payment_id", length = 100)
//    private String paymentId;

//    /** 예약과 연결 (1:1 관계) */
//    @OneToOne(fetch = FetchType.LAZY)
//    @JoinColumn(name = "reservation_id", nullable = false, foreignKey = @ForeignKey(name = "fk_payment_reservation"))
//    private Reservation reservation;

    /** 결제수단 (CARD, KAKAO_PAY 등) */
    @Column(name = "pay_method", nullable = false, length = 50)
    private String payMethod;

    /** 결제금액 */
    @Column(name = "amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    /** 결제 상태 */
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private PaymentStatus status = PaymentStatus.SUCCESS;

    /** PG 거래 고유번호 */
    @Column(name = "pg_tid", length = 100)
    private String pgTid;

    /** 결제 승인일시 */
    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    /** 결제 취소일시 */
    @Column(name = "canceled_at")
    private LocalDateTime canceledAt;

    /** 생성일시 */
    @CreationTimestamp
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    /** 수정일시 */
    @UpdateTimestamp
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    /**
     * dto -> entity
     * @param dto
     * @return
     */
    public static Payment from(PaymentRequestDTO dto) {
        Payment payment = new Payment();
        payment.setOrderNo(dto.getOrderNo());
        payment.setAmount(BigDecimal.valueOf(dto.getAmount()));
        payment.setPayMethod("TOSS-PAY"); // 기본값 또는 프론트에서 받은 값으로 변경 가능
        // pgTid, approvedAt, canceledAt 등은 결제 완료 후 업데이트 시점에 set
        return payment;
    }
}
