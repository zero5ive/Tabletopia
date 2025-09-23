package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "restaurant",
    indexes = {
        @Index(name = "idx_restaurant_location", columnList = "latitude, longitude"),
        @Index(name = "idx_restaurant_region", columnList = "region_code"),
        @Index(name = "idx_restaurant_category", columnList = "restaurant_category_id"),
        @Index(name = "idx_restaurant_is_deleted", columnList = "is_deleted")
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

  // 연관관계: Category
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_category_id", nullable = false)
  private RestaurantCategory category;

  // 연관관계: Account
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_account_id", nullable = false)
  private RestaurantAccount account;

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

  // 엔티티 저장 시 자동 시간 세팅
  @PrePersist
  protected void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  protected void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
