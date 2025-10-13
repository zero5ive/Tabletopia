package com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 레스토랑 기본 운영시간 엔티티
 *
 * 요일별 기본 영업시간, 휴무 여부, 브레이크 타임 등을 관리한다.
 * 예: 월~금 09:00~22:00, 토요일 단축 영업, 일요일 휴무 등
 *
 * DB 매핑: restaurant_opening_hour
 *
 * 주요 역할:
 *  - 매장별 요일 단위 기본 영업시간 저장
 *  - 휴무일(isHoliday = true)인 경우 open/closeTime 은 null
 *  - 관리자 페이지에서 CRUD 가능
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Entity
@Table(
    name = "restaurant_opening_hour",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_restaurant_opening_day",
            columnNames = {"restaurant_id", "day_of_week"}
        )
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantOpeningHour {

  /** 운영시간 고유 ID (Primary Key) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 요일 (0=일요일 ~ 6=토요일) */
  @Column(name = "day_of_week", nullable = false)
  private int dayOfWeek;

  /** 오픈 시간 (휴무일이면 null) */
  @Column(name = "open_time", nullable = true)
  private LocalTime openTime;

  /** 마감 시간 (휴무일이면 null) */
  @Column(name = "close_time", nullable = true)
  private LocalTime closeTime;

  /** 휴무 여부 (true면 open/closeTime 무시) */
  @Column(name = "is_holiday", nullable = false)
  private Boolean isHoliday = false;

  /** 브레이크 시작 시간 (없을 경우 null) */
  @Column(name = "break_start_time", nullable = true)
  private LocalTime breakStartTime;

  /** 브레이크 종료 시간 (없을 경우 null) */
  @Column(name = "break_end_time", nullable = true)
  private LocalTime breakEndTime;

  /** 예약 간격 (분 단위, 설정되지 않은 경우 null) */
  @Column(name = "reservation_interval", nullable = true)
  private Integer reservationInterval;

  /** 등록일시 (자동 생성) */
  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 수정일시 (자동 갱신) */
  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  /** 소속 레스토랑 (FK) */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(
      name = "restaurant_id",
      nullable = false,
      foreignKey = @ForeignKey(name = "fk_openinghour_restaurant")
  )
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Restaurant restaurant;
}
