package com.tabletopia.restaurantservice.domain.restaurantTable.entity;

import com.tabletopia.restaurantservice.domain.restaurantTable.enums.TableState;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * 실시간 테이블 상태 엔티티
 *
 * @author 서예닮
 * @since 2025-10-18
 */
@Entity
@Getter
@Table(name = "table_realtime_state")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TableRealtimeState {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "restaurant_table_id", nullable = false, unique = true)
  private Long restaurantTableId;

  @Enumerated(EnumType.STRING)
  @Column(name = "table_state", nullable = false)
  private TableState tableState = TableState.AVAILABLE;

  @Column(name = "start_at")
  private LocalDateTime startAt;

  @Column(name = "end_at")
  private LocalDateTime endAt;

  @Column(name = "current_people_count")
  private Integer currentPeopleCount;

  @Enumerated(EnumType.STRING)
  @Column(name = "source_type")
  private SourceType sourceType;

  @Column(name = "source_id")
  private Long sourceId;

  @Column(name = "customer_info", columnDefinition = "JSON")
  private String customerInfo;

  @Column(name = "manager_notes")
  private String managerNotes;

  @Column(name = "updated_by")
  private Long updatedBy;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  /**
   * 테이블 사용 소스 타입
   */
  public enum SourceType {
    RESERVATION,
    WALK_IN,
    WAITING
  }

  // ======================================
  // 생성자
  // ======================================
  public TableRealtimeState(Long restaurantTableId) {
    this.restaurantTableId = restaurantTableId;
    this.tableState = TableState.AVAILABLE;
  }

  // ======================================
  // 비즈니스 메서드
  // ======================================

  /**
   * 테이블을 사용 중(OCCUPIED) 상태로 변경
   */
  public void occupy(SourceType sourceType, Long sourceId, Integer peopleCount) {
    this.tableState = TableState.OCCUPIED;
    this.sourceType = sourceType;
    this.sourceId = sourceId;
    this.currentPeopleCount = peopleCount;
    this.startAt = LocalDateTime.now();
  }

  /**
   * 테이블을 예약(RESERVED) 상태로 변경
   */
  public void reserve(Long sourceId, Integer peopleCount, LocalDateTime endAt) {
    this.tableState = TableState.RESERVED;
    this.sourceType = SourceType.RESERVATION;
    this.sourceId = sourceId;
    this.currentPeopleCount = peopleCount;
    this.endAt = endAt;
  }

  /**
   * 테이블을 사용 가능(AVAILABLE) 상태로 변경
   */
  public void release() {
    this.tableState = TableState.AVAILABLE;
    this.sourceType = null;
    this.sourceId = null;
    this.currentPeopleCount = null;
    this.startAt = null;
    this.endAt = null;
  }

  /**
   * 테이블을 정리 중(CLEANING) 상태로 변경
   */
  public void setCleaning() {
    this.tableState = TableState.CLEANING;
  }

  /**
   * 테이블을 사용 불가(OUT_OF_ORDER) 상태로 변경
   */
  public void setOutOfOrder(String notes) {
    this.tableState = TableState.OUT_OF_ORDER;
    this.managerNotes = notes;
  }
}
