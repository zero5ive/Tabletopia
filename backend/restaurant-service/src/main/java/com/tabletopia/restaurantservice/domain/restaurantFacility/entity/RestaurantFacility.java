package com.tabletopia.restaurantservice.domain.restaurantFacility.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.facility.entity.Facility;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

/**
 * @author 김지민
 * @since 2025-10-14
 * @description 레스토랑-편의시설 매핑 엔티티
 * 매장에 어떤 편의시설이 활성화되어 있는지 관리한다.
 * created_at, updated_at 은 엔티티 저장 시 자동으로 설정된다.
 */
@Entity
@Table(name = "restaurant_facility")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantFacility {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "restaurantFacilities"})
  private Restaurant restaurant;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "facility_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private Facility facility;

  @Column(name = "facility_info")
  private String facilityInfo;

  @Column(name = "is_active", nullable = false)
  private boolean isActive = true;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

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
