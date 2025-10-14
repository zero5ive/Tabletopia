package com.tabletopia.restaurantservice.domain.reservation.entity;

import com.tabletopia.restaurantservice.domain.reservation.enums.ReservationStatus;
import com.tabletopia.restaurantservice.dto.RestaurantSnapshot;
import com.tabletopia.restaurantservice.dto.TableSnapshot;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

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
public class Reservation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @Column(name = "restaurant_id", nullable = false)
  private Long restaurantId;

  @Column(name = "restaurant_table_id", nullable = false)
  private Long restaurantTableId;

  @Column(name = "people_count", nullable = false)
  private Integer peopleCount;

  // ============ 스냅샷 정보 (예약 당시 상태 보존) ============
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

  // ============ 예약 상태 및 시간 ============
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

  // ============ 정적 팩토리 메서드 ============

  /**
   * 새 예약 생성
   *
   * @param userId 사용자 ID
   * @param restaurantId 레스토랑 ID
   * @param restaurantTableId 테이블 ID
   * @param peopleCount 예약 인원
   * @param reservationAt 예약 시간
   * @param restaurantSnapshot 레스토랑 스냅샷
   * @param tableSnapshot 테이블 스냅샷
   * @return 새로운 예약 객체
   */
  public static Reservation createReservation(
      Long userId,
      Long restaurantId,
      Long restaurantTableId,
      Integer peopleCount,
      LocalDateTime reservationAt,
      RestaurantSnapshot restaurantSnapshot,
      TableSnapshot tableSnapshot) {

    return new Reservation(
        userId,
        restaurantId,
        restaurantTableId,
        peopleCount,
        reservationAt,
        restaurantSnapshot,
        tableSnapshot
    );
  }

  // ============ 생성자 ============

  /**
   * 예약 생성자
   */
  private Reservation(
      Long userId,
      Long restaurantId,
      Long restaurantTableId,
      Integer peopleCount,
      LocalDateTime reservationAt,
      RestaurantSnapshot restaurantSnapshot,
      TableSnapshot tableSnapshot) {

    this.userId = userId;
    this.restaurantId = restaurantId;
    this.restaurantTableId = restaurantTableId;
    this.peopleCount = peopleCount;
    this.reservationAt = reservationAt;

    // 스냅샷 정보 저장
    this.restaurantNameSnapshot = restaurantSnapshot.getName();
    this.restaurantAddressSnapshot = restaurantSnapshot.getAddress();
    this.restaurantPhoneSnapshot = restaurantSnapshot.getTel();
    this.restaurantTableNameSnapshot = tableSnapshot.getRestaurantTableName();
    this.restaurantTableCapacitySnapshot = tableSnapshot.getRestaurantTableCapacity();

    this.reservationState = ReservationStatus.PENDING;
  }

  // ============ JPA 생명주기 메서드 ============

  @PrePersist
  protected void onCreate() {
    createdAt = LocalDateTime.now();
    updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    updatedAt = LocalDateTime.now();
  }

  // ============ 비즈니스 로직 ============

  /**
   * 예약 확정
   *
   * @throws IllegalStateException PENDING 상태가 아닌 경우
   */
  public void confirmReservation() {
    if (this.reservationState != ReservationStatus.PENDING) {
      throw new IllegalStateException("PENDING 상태에서만 확정할 수 있습니다");
    }
    this.reservationState = ReservationStatus.CONFIRMED;
    this.processedAt = LocalDateTime.now();
  }

  /**
   * 예약 취소
   *
   * @param reason 취소 사유
   * @throws IllegalStateException 이미 완료되었거나 취소된 경우
   */
  public void cancelReservation(String reason) {
    if (this.reservationState == ReservationStatus.COMPLETED ||
        this.reservationState == ReservationStatus.CANCELLED) {
      throw new IllegalStateException("완료되거나 취소된 예약은 취소할 수 없습니다");
    }

    this.reservationState = ReservationStatus.CANCELLED;
    this.rejectedReason = reason;
    this.processedAt = LocalDateTime.now();
  }

  /**
   * 예약 완료 처리
   *
   * @throws IllegalStateException CONFIRMED 상태가 아닌 경우
   */
  public void completeReservation() {
    if (this.reservationState != ReservationStatus.CONFIRMED) {
      throw new IllegalStateException("확정된 예약만 완료할 수 있습니다");
    }
    this.reservationState = ReservationStatus.COMPLETED;
    this.completedAt = LocalDateTime.now();
  }

  /**
   * 노쇼 처리
   *
   * @throws IllegalStateException CONFIRMED 상태가 아닌 경우
   */
  public void markAsNoShow() {
    if (this.reservationState != ReservationStatus.CONFIRMED) {
      throw new IllegalStateException("확정된 예약만 노쇼 처리할 수 있습니다");
    }
    this.reservationState = ReservationStatus.NO_SHOW;
    this.processedAt = LocalDateTime.now();
  }

  /**
   * 예약 가능한 시간대인지 확인
   *
   * @return 예약 가능 여부
   */
  public boolean isWithinReservationTime() {
    LocalDateTime now = LocalDateTime.now();
    return now.isAfter(this.reservationAt.minusMinutes(10)) &&
        now.isBefore(this.reservationAt.plusHours(2));
  }
}