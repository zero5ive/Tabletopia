package com.tabletopia.restaurantservice.domain.restaurantFacility.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * 매장별 편의시설 매핑 엔티티
 *
 * 매장(Restaurant)과 편의시설(Facility) 간의 다대다 관계를 표현하는 중간 엔티티.
 * 매장 삭제 시 관련 편의시설 매핑도 함께 삭제된다 (ON DELETE CASCADE).
 *
 * createdAt, updatedAt은 엔티티 저장 및 수정 시 자동으로 설정된다.
 *
 * DB 스키마 예시:
 *  - restaurant_facility (
 *        id BIGINT AUTO_INCREMENT PRIMARY KEY,
 *        restaurant_id BIGINT NOT NULL,
 *        facility_id BIGINT NOT NULL,
 *        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
 *        updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
 *        UNIQUE KEY (restaurant_id, facility_id)
 *    )
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Entity
@Table(
    name = "restaurant_facility",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_restaurant_facility",
            columnNames = {"restaurant_id", "facility_id"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantFacility {

  /** 고유 식별자 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 매장 정보 (N:1 관계) */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "restaurantFacilities"})
  private Restaurant restaurant;

  /** 편의시설 정보 (N:1 관계) */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "facility_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Facility facility;

  /** 생성 일시 */
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 수정 일시 */
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  /** 최초 저장 시 자동 설정 */
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  /** 수정 시 자동 갱신 */
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
