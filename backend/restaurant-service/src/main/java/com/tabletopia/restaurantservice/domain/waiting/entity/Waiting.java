package com.tabletopia.restaurantservice.domain.waiting.entity;

import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * 웨이팅 엔티티
 *
 * @author 성유진
 * @since 2025-09-26
 */

@Entity
@Getter
@Table(name = "waiting")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Waiting {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  private Long restaurantId;

  private Long userId;

  private Integer peopleCount;

  private Integer waitingNumber;

  private Integer delayCount;

  @Enumerated(EnumType.STRING)
  private WaitingState waitingState;

  // 스냅샷 정보
  private String restaurantNameSnapshot;

  private String assignedTableName;

  private Integer assignedTableCapacity;

  private LocalDateTime calledAt;

  @CreationTimestamp
  private LocalDateTime createdAt;

  @UpdateTimestamp
  private LocalDateTime updatedAt;

  // ======================================
  // 생성자 (필수 값 초기화)
  // ======================================
  public Waiting(Long restaurantId,
      Long userId,
      Integer peopleCount,
      String restaurantNameSnapshot) {

    this.restaurantId = restaurantId;
    this.userId = userId;
    this.peopleCount = peopleCount;
    this.restaurantNameSnapshot = restaurantNameSnapshot;
    this.waitingNumber = 0;

    this.waitingState = WaitingState.WAITING; // 기본 상태
    this.delayCount = 0; // 기본 지연 횟수
    this.assignedTableName = null;
    this.assignedTableCapacity = null;
    this.calledAt = null;
  }

  //waitingnumber 설정 메서드
  public void assignWaitingNumber(Integer waitingNumber) {
    this.waitingNumber = waitingNumber;
  }

  //waitingState 설정 메섣,
  public void assignWaitingState(WaitingState waitingState) {
    this.waitingState = waitingState;
  }

  //calledAt 설정 메서드
  public void setCalledAt(LocalDateTime calledAt) {this.calledAt = calledAt;}

}
