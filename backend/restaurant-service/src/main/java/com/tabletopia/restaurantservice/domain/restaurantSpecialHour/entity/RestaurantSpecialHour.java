package com.tabletopia.restaurantservice.domain.restaurantSpecialHour.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;

/**
 * 레스토랑 특별 운영시간 엔티티
 *
 * 특정 날짜(명절, 행사일, 휴무일 등)의 개별적인 영업시간을 관리한다.
 * 예: 설날 단축 영업, 크리스마스 연장 영업, 특정일 휴무 등
 *
 * DB 매핑: restaurant_special_hour
 *
 * 주요 역할:
 *  - 기본 운영시간(요일 단위)과 별도로 특정 날짜별 시간 정보를 관리
 *  - 완전 휴무(isClosed = true) 시 open/closeTime 은 null
 *  - 관리자 페이지에서 CRUD 가능
 *
 * @author 김지민
 * @since 2025-10-13
 */
@Entity
@Table(
    name = "restaurant_special_hour",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_restaurant_special_date",
            columnNames = {"restaurant_id", "special_date"}
        )
    }
)
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantSpecialHour {

  /** 특별 운영시간 ID (Primary Key) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 특정 날짜 (예: 2025-02-09, 설날) */
  @Column(name = "special_date", nullable = false)
  private LocalDate specialDate;

  /** 오픈 시간 (null이면 휴무 또는 단축영업 미설정) */
  @Column(name = "open_time", nullable = true)
  private LocalTime openTime;

  /** 마감 시간 (null이면 휴무 또는 단축영업 미설정) */
  @Column(name = "close_time", nullable = true)
  private LocalTime closeTime;

  /** 완전 휴무 여부 (true면 open/closeTime 무시) */
  @Column(name = "is_closed", nullable = false)
  private Boolean isClosed = false;

  /** 비고 (예: 설날 단축영업, 추석 휴무 등 관리자 메모) */
  @Column(name = "special_info", length = 100)
  private String specialInfo;

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
      foreignKey = @ForeignKey(name = "fk_specialhour_restaurant")
  )
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Restaurant restaurant;
}
