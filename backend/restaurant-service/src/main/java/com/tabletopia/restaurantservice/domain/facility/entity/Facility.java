package com.tabletopia.restaurantservice.domain.facility.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

// 편의시설 마스터 테이블
@Entity
@Table(name = "facility")
@Getter
@Setter
public class Facility {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  // 시설 이름
  @Column(nullable = false, unique = true, length = 50)
  private String name;

  // 생성 일시
  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  // 수정 일시
  @Column(name = "updated_at")
  private LocalDateTime updatedAt;
}
