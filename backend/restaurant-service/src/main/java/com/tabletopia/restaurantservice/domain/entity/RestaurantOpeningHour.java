package com.tabletopia.restaurantservice.domain.entity;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 레스토랑 운영 시간 엔티티
 * 특정 레스토랑의 요일별 운영 시간, 브레이크 타임, 휴무 여부 등을 관리한다.
 * DB의 restaurant_opening_hour 테이블과 매핑된다.
 * @author 김지민
 * @since 2025-09-26
 */
@Entity
@Table(
    name = "restaurant_opening_hour",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_restaurant_opening_day", columnNames = {"restaurant_id", "day_of_week"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOpeningHour {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "day_of_week", nullable = false)
  private int dayOfWeek;

  @Column(name = "open_time", nullable = false)
  private LocalTime openTime;

  @Column(name = "close_time", nullable = false)
  private LocalTime closeTime;

  @Column(name = "is_holiday", nullable = false)
  private Boolean isHoliday = false;

  @Column(name = "break_start_time")
  private LocalTime breakStartTime;

  @Column(name = "break_end_time")
  private LocalTime breakEndTime;

  @Column(name = "reservation_interval", nullable = false)
  private int reservationInterval;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;


  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false, foreignKey = @ForeignKey(name = "fk_openinghour_restaurant"))
  private Restaurant restaurant;

  /**
   * 엔티티 최초 저장 시 자동 시간 세팅
   * @author 김지민
   * @since 2025-09-26
   */
  @PrePersist
  void onCreate() {
    this.createdAt = this.updatedAt = LocalDateTime.now();
  }

  /**
   * 엔티티 업데이트 시 자동 수정일 갱신
   * @author 김지민
   * @since 2025-09-26
   */
  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
