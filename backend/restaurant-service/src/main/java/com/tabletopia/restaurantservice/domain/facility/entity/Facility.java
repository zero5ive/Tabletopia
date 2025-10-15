package com.tabletopia.restaurantservice.domain.facility.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 편의시설 마스터 엔티티
 *
 * 매장에서 공통적으로 사용하는 편의시설(Facility) 정보를 정의한다.
 * 예: Wi-Fi, 주차 가능, 반려동물 동반 가능 등
 *
 * 단순 마스터 테이블로, 별도의 생성일/수정일 컬럼은 관리하지 않는다.
 *
 * DB 스키마:
 *  - facility (
 *        id BIGINT AUTO_INCREMENT PRIMARY KEY,
 *        name VARCHAR(50) NOT NULL UNIQUE
 *    )
 *
 * @author 김지민
 * @since 2025-10-14
 */
@Entity
@Table(name = "facility")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Facility {

  /** 고유 식별자 (PK) */
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  /** 시설 이름 (예: Wi-Fi, 주차 가능 등) */
  @Column(nullable = false, unique = true, length = 50)
  private String name;
}
