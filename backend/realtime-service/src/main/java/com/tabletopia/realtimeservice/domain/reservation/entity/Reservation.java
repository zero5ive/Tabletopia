package com.tabletopia.realtimeservice.domain.reservation.entity;

import com.tabletopia.realtimeservice.domain.reservation.enums.ReservationStatus;
import com.tabletopia.realtimeservice.dto.RestaurantSnapshot;
import com.tabletopia.realtimeservice.dto.TableSnapshot;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
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
//
//  @Column(name = "updated_at", nullable = false)
//  private LocalDateTime updatedAt;

  // ============ Enum 정의 ============

  // ============ 생성자 ============

  public Reservation(
      Long id,
      Long userId,
      RestaurantSnapshot restaurantSnapshot,
      TableSnapshot tableSnapshot,
      LocalDateTime reservationAt) {
    this.id = id;
    this.userId = userId;
    this.restaurantId = restaurantSnapshot.getId();
    this.restaurantTableNameSnapshot = tableSnapshot.getRestaurantTableName();
    this.restaurantTableCapacitySnapshot = tableSnapshot.getRestaurantTableCapacity();
    this.reservationState = ReservationStatus.PENDING;
    this.reservationAt = reservationAt;
    this.processedAt = null;
    this.completedAt = null;
    this.rejectedReason = null;
    this.restaurantPhoneSnapshot = restaurantSnapshot.getTel();
    this.restaurantAddressSnapshot = restaurantSnapshot.getAddress();
    this.createdAt =  LocalDateTime.now();
  }

  // ============ 정적 팩토리 메서드 ============

  /**
   * 새 예약 생성
   */
  private Reservation(Long userId, Long restaurantId, Long restaurantTableId,
      Integer peopleCount, LocalDateTime reservationAt,
      RestaurantSnapshot restaurantSnapshot, TableSnapshot tableSnapshot) {

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
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  // ============ 비즈니스 로직 ============
}