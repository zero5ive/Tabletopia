package com.tabletopia.restaurantservice.domain.entity;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 레스토랑 테이블 엔티티
 *
 * 레스토랑 내 개별 테이블 정보를 관리한다.
 * (예: 11번 테이블, 창가석 등)
 */
@Entity
@Table(
    name = "restaurant_table",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_restaurant_table_name",
            columnNames = {"restaurant_id", "name"}
        )
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false, foreignKey = @ForeignKey(name = "fk_table_restaurant"))
  private Restaurant restaurant;

  @Column(nullable = false, length = 50)
  private String name;

  @Column(name = "min_capacity")
  private Integer minCapacity;

  @Column(name = "max_capacity", nullable = false)
  private Integer maxCapacity;

  @Column(name = "x_position", nullable = false)
  private Integer xPosition;

  @Column(name = "y_position", nullable = false)
  private Integer yPosition;

  @Column(nullable = false, length = 20)
  private String shape = "RECTANGLE";

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

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