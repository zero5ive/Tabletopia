package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * 레스토랑 카테고리 엔티티
 * 레스토랑의 분류(예: 한식, 중식, 양식 등)를 관리한다.
 * DB의 restaurant_category 테이블과 매핑된다.
 * @author 김지민
 * @since 2025-09-26
 */
@Entity
@Table( name = "restaurant_category")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantCategory {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 50, unique = true)
  private String name;

  private Integer displayOrder;

  @Column(nullable = false)
  private Boolean isDeleted = false;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
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
