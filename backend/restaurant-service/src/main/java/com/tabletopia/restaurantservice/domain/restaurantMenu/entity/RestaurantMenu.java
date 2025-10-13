package com.tabletopia.restaurantservice.domain.restaurantMenu.entity;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;
import org.hibernate.annotations.Where;

/**
 * 레스토랑 메뉴 엔티티
 * 각 매장의 개별 메뉴 정보를 관리한다.
 * 매장(Restaurant)과 다대일 관계를 맺으며,
 * 메뉴명, 가격, 설명, 이미지, 품절 상태 등을 포함한다.
 * @author 김지민
 * @since 2025-10-10
 */
@Entity
@Table(name = "restaurant_menu")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE restaurant_menu SET is_deleted = true WHERE id = ?")
@Where(clause = "is_deleted = false")

public class RestaurantMenu {

  /** 메뉴 고유 ID (Primary Key) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 메뉴가 속한 매장 (FK) */
  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  private Restaurant restaurant;

  /** 메뉴 이름 */
  @Column(nullable = false, length = 100)
  private String name;

  /** 메뉴 가격 (₩ 단위) */
  @Column(nullable = false)
  private int price;

  /** 메뉴 설명 */
  @Column(length = 255)
  private String description;

  /** 메뉴 카테고리 (메인, 사이드, 음료 등) */
  @Column(length = 50)
  private String category;

  /** 메뉴 이미지 파일명 (서버 저장용) */
  private String imageFilename;

  /** 품절 여부 */
  @Column(name = "is_soldout", nullable = false)
  private boolean isSoldout = false;

  /** 논리 삭제 여부 (Soft Delete) */
  @Column(name = "is_deleted", nullable = false)
  private boolean isDeleted = false;

  /** 등록일시 (자동 생성) */
  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  /** 수정일시 (자동 갱신) */
  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;
}
