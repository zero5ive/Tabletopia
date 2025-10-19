package com.tabletopia.restaurantservice.domain.waiting.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.user.entity.User;
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

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler", "waitings"})
  private Restaurant restaurant;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private User user;

  private Integer peopleCount;

  private Integer waitingNumber;

  private Integer delayCount = 0;

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

  private static final int  MAX_DELAY_COUNT = 3; //미루기 최대 횟수

  //미루기 가능 여부 체크
  public boolean canDelay(){
    return this.delayCount < MAX_DELAY_COUNT;
  }


  //미루기 횟수 카운트
  public void increaseDelayCount(){
    if(!canDelay()){
       throw new IllegalStateException("미루기 횟수를 초과했습니다.");
    }
    this.delayCount++;
  }

  //웨이팅 번호 변경
  public void updateWaitingNumber(Integer waitingNumber){
    this.waitingNumber = waitingNumber;
  }

  // ======================================
  // 생성자 (필수 값 초기화)
  // ======================================
  public Waiting(Restaurant restaurant,
      User user,
      Integer peopleCount,
      String restaurantNameSnapshot) {

    this.restaurant = restaurant;
    this.user = user;
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

  //assignedTableName 설정 메서드
  public void setAssignedTableName(String assignedTableName) {this.assignedTableName = assignedTableName;}

  //assignedTableCapacity 설정 메서드
  public void setAssignedTableCapacity(Integer assignedTableCapacity) {this.assignedTableCapacity = assignedTableCapacity;}

}
