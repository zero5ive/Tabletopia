package com.tabletopia.restaurantservice.domain.reservation.entity;

import com.tabletopia.restaurantservice.domain.payment.entity.Payment;
import com.tabletopia.restaurantservice.domain.reservation.dto.ReservationRequest;
import com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 예약 엔티티
 *
 * @author 김예진
 * @since 2025-09-20
 */
@Entity
@Table(name = "reservation")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "name")
  private String name;

  @Column(name = "phone_number")
  private String phoneNumber;

  @Column(name = "restaurant_id", nullable = false)
  private Long restaurantId;

  @Column(name = "restaurant_table_id", nullable = false)
  private Long restaurantTableId;

  @Column(name = "people_count", nullable = false)
  private Integer peopleCount;

  @Column(name = "restaurant_name_snapshot", nullable = false, length = 100)
  private String restaurantNameSnapshot;

  @Column(name = "restaurant_address_snapshot", nullable = false, length = 255)
  private String restaurantAddressSnapshot;

  @Column(name = "restaurant_phone_snapshot", nullable = false, length = 20)
  private String restaurantPhoneSnapshot;

  @Column(name = "restaurant_table_name_snapshot", nullable = false, length = 50)
  private String restaurantTableNameSnapshot;

  @Column(name = "restaurant_table_capacity_snapshot", nullable = false)
  private Integer restaurantTableCapacitySnapshot;

  @Enumerated(EnumType.STRING)
  @Column(name = "reservation_state", nullable = false)
  private ReservationStatus reservationState;

  @Column(name = "reservation_at", nullable = false)
  private LocalDateTime reservationAt;

  @Column(name = "processed_at")
  private LocalDateTime processedAt;

  @Column(name = "completed_at")
  private LocalDateTime completedAt;

  @Column(name = "rejected_reason", length = 500)
  private String rejectedReason;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @OneToOne
  @JoinColumn(name = "payment_id", nullable = false)  // FK 컬럼 지정
  private Payment payment;

  // ==================== Setter 메서드 ====================

  /**
   * Payment 설정
   * @param payment 결제 정보
   */
  public void setPayment(Payment payment) {
    this.payment = payment;
  }

  // ==================== JPA 생명주기 메서드 ====================
  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // ==================== 비즈니스 로직 ====================

  /**
   * 예약 확정
   *
   * @throws IllegalStateException PENDING 상태가 아닌 경우
   */
  public void confirmReservation() {
    if (reservationState != ReservationStatus.PENDING) {
      throw new IllegalStateException("PENDING 상태에서만 확정할 수 있습니다");
    }
    reservationState = ReservationStatus.CONFIRMED;
    processedAt = LocalDateTime.now();
  }

  /**
   * 예약 취소
   *
   * @param reason 취소 사유
   * @throws IllegalStateException 이미 완료되었거나 취소된 경우
   */
  public void cancelReservation(String reason) {
    if (reservationState == ReservationStatus.COMPLETED || reservationState == ReservationStatus.CANCELLED) {
      throw new IllegalStateException("완료되거나 취소된 예약은 취소할 수 없습니다");
    }
    reservationState = ReservationStatus.CANCELLED;
    rejectedReason = reason;
    processedAt = LocalDateTime.now();
  }

  /**
   * 예약 완료 처리
   *
   * @throws IllegalStateException CONFIRMED 상태가 아닌 경우
   */
  public void completeReservation() {
    if (reservationState != ReservationStatus.CONFIRMED) {
      throw new IllegalStateException("확정된 예약만 완료할 수 있습니다");
    }
    reservationState = ReservationStatus.COMPLETED;
    completedAt = LocalDateTime.now();
  }

  /**
   * 노쇼 처리
   *
   * @throws IllegalStateException CONFIRMED 상태가 아닌 경우
   */
  public void markAsNoShow() {
    if (reservationState != ReservationStatus.CONFIRMED) {
      throw new IllegalStateException("확정된 예약만 노쇼 처리할 수 있습니다");
    }
    reservationState = ReservationStatus.NO_SHOW;
    processedAt = LocalDateTime.now();
  }

  /**
   * 예약 가능한 시간대인지 확인
   *
   * @return 예약 가능 여부
   */
  public boolean isWithinReservationTime() {
    LocalDateTime now = LocalDateTime.now();
    return now.isAfter(reservationAt.minusMinutes(10)) && now.isBefore(reservationAt.plusHours(2));
  }

  // ==================== DTO → 엔티티 변환 편의 메서드 ====================

  /**
   * ReservationRequest를 기반으로 Reservation 엔티티 생성
   *
   * @param userId 사용자 ID
   * @param request 프론트엔드에서 받은 예약 요청 DTO
   * @param tableCapacity 테이블 수용 인원
   * @return Reservation 엔티티
   */
  public static Reservation fromRequest(Long userId,
      ReservationRequest request,
      Integer tableCapacity) {
    return Reservation.builder()
        .userId(userId)
        .name(request.getCustomerInfo().getName())
        .phoneNumber(request.getCustomerInfo().getPhoneNumber())
        .restaurantId(request.getRestaurantId())
        .restaurantTableId(request.getRestaurantTableId())
        .peopleCount(request.getPeopleCount())
        .reservationAt(request.getReservationDateTime())
        .restaurantNameSnapshot(request.getRestaurantName())
        .restaurantAddressSnapshot(request.getRestaurantAddress())
        .restaurantPhoneSnapshot(request.getRestaurantPhone())
        .restaurantTableNameSnapshot(request.getRestaurantTableNameSnapshot())
        .restaurantTableCapacitySnapshot(tableCapacity)
        .reservationState(ReservationStatus.PENDING)
        .build();
  }
}
