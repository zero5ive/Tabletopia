package com.tabletopia.restaurantservice.domain.restaurantImage.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;

/**
 * 매장 이미지 엔티티
 *
 * 매장(Restaurant)에 연결된 이미지 정보를 관리한다.
 * 각 이미지에는 대표 여부, 정렬 순서 등의 메타데이터가 포함된다.
 *
 * DB 스키마는 restaurant_image 테이블을 기준으로 한다.
 *
 * @author 김지민
 * @since 2025-10-15
 */
@Entity
@Table(name = "restaurant_image")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantImage {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  private Restaurant restaurant;

  @Column(name = "image_url", nullable = false, length = 255)
  private String imageUrl;

  @Column(name = "is_main", nullable = false)
  private boolean isMain = false;

  @Column(name = "sort_order", nullable = false)
  private int sortOrder = 0;

  @Column(name = "created_at", nullable = false)
  private LocalDateTime createdAt = LocalDateTime.now();

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt = LocalDateTime.now();

  @PrePersist
  public void prePersist() {
    this.createdAt = this.createdAt == null ? LocalDateTime.now() : this.createdAt;
    this.updatedAt = this.updatedAt == null ? LocalDateTime.now() : this.updatedAt;
  }

  @PreUpdate
  public void preUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
