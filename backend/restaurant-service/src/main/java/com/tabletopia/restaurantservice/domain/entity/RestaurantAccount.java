package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
 * 레스토랑 계정 엔티티
 * 레스토랑 관리자 계정 정보를 관리한다.
 * 로그인 및 레스토랑 운영자 인증에 사용된다.
 * @author 김지민
 * @since 2025-09-26
 */
@Entity
@Table(name = "restaurant_account")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantAccount {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 100, unique = true)
  private String email;

  @Column(nullable = false, length = 100)
  private String password;

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
