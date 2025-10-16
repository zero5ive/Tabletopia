package com.tabletopia.restaurantservice.domain.restaurant.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.restaurantCategory.entity.RestaurantCategory;
import com.tabletopia.restaurantservice.domain.restaurantFacility.entity.RestaurantFacility;
import com.tabletopia.restaurantservice.domain.restaurantImage.entity.RestaurantImage;
import com.tabletopia.restaurantservice.domain.restaurantOpeningHour.entity.RestaurantOpeningHour;
import com.tabletopia.restaurantservice.domain.restaurantreview.entity.RestaurantReview;
import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 레스토랑 엔티티
 * 매장 기본 정보를 관리하며, Soft Delete 및 Auditing 기능을 지원한다.
 * 매장 등록, 조회, 수정, 삭제 시 사용된다.
 * @author 김지민
 * @since 2025-10-09
 */
@Entity
@Table(name = "restaurant")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE restaurant SET is_deleted = true WHERE id = ?")
@SQLRestriction("is_deleted = false")
public class Restaurant {

  /** 매장 고유 ID (Primary Key) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 매장명 */
  @Column(length = 100, nullable = false)
  private String name;

  /** 매장 주소 */
  @Column(length = 255, nullable = false)
  private String address;

  /**
   * 위도 (Latitude)
   * 소수점 8자리까지 저장
   */
  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal latitude;

  /**
   * 경도 (Longitude)
   * 소수점 8자리까지 저장
   */
  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal longitude;

  /** 행정구역 코드 */
  @Column(name = "region_code", length = 20, nullable = false)
  private String regionCode;

  /** 매장 전화번호 */
  @Column(name = "phone_number", length = 20, nullable = false)
  private String phoneNumber;

  /** 매장 설명 */
  @Column(length = 255, nullable = false)
  private String description;

  /** 논리 삭제 여부 (Soft Delete) */
  @Column(name = "is_deleted", nullable = false)
  private Boolean isDeleted = false;

  /** 등록일시 (자동 생성) */
  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 수정일시 (자동 갱신) */
  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  /** 매장 카테고리 (FK) */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_category_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private RestaurantCategory restaurantCategory;

  @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY)
  @JsonIgnoreProperties("restaurant")
  private List<RestaurantOpeningHour> openingHours = new ArrayList<>();

  @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY)
  @JsonIgnoreProperties("restaurant")
  private List<RestaurantFacility> restaurantFacilities = new ArrayList<>();

  @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY)
  @JsonIgnoreProperties("restaurant")
  private List<RestaurantReview> reviews = new ArrayList<>();

  @OneToMany(mappedBy = "restaurant", fetch = FetchType.LAZY)
  @JsonIgnoreProperties("restaurant")
  private List<RestaurantImage> restaurantImage = new ArrayList<>();

  /** 매장 소유 계정 (FK) */
//  @ManyToOne(fetch = FetchType.LAZY)
//  @JoinColumn(name = "restaurant_account_id", nullable = false)
//  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
//  private RestaurantAccount restaurantAccount;
}
