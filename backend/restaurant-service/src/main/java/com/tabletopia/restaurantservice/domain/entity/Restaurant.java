package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 레스토랑 엔티티
 * 레스토랑의 기본 정보 및 연관관계를 관리한다.
 * DB의 restaurant 테이블과 매핑된다.
 * @author 김지민
 * @since 2025-09-26
 * NOTE: regionCode, category에 인덱스가 설정되어 있다.
 */
@Entity
@Table(
    name = "restaurant",
    indexes = {
        @Index(name = "idx_restaurant_region", columnList = "region_code"),
        @Index(name = "idx_restaurant_category", columnList = "restaurant_category_id")
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Restaurant {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 100, nullable = false)
  private String name;

  @Column(length = 255, nullable = false)
  private String address;

  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal latitude;

  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal longitude;

  @Column(length = 20, nullable = false)
  private String regionCode;

  @Column(length = 20, nullable = false)
  private String phoneNumber;

  @Column(length = 255, nullable = false)
  private String description;

  @Column(nullable = false)
  private Boolean isDeleted = false;

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_category_id", nullable = false)
  private RestaurantCategory category;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_account_id", nullable = false)
  private RestaurantAccount account;

  /**
   * 엔티티 저장 전 자동 시간 세팅
   * @author 김지민
   * @since 2025-09-26
   */
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  /**
   * 엔티티 업데이트 시 자동 수정일 갱신
   * @author 김지민
   * @since 2025-09-26
   */
  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
