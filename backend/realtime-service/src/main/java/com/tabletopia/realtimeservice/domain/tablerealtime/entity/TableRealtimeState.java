package com.tabletopia.realtimeservice.domain.tablerealtime.entity;

import com.tabletopia.realtimeservice.domain.tablerealtime.enums.SourceType;
import com.tabletopia.realtimeservice.domain.tablerealtime.enums.TableState;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

/**
 * 실시간 테이블 상태 엔티티
 *
 * @author 김예진
 * @since 2025-09-20
 */
@Entity
@Getter
@Table(name = "table_realtime_state")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class TableRealtimeState {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Enumerated(EnumType.STRING)
  private TableState tableState;

  @CreationTimestamp
  private LocalDateTime startAt;

  @UpdateTimestamp
  private LocalDateTime endAt;

  private Integer currentPeopleCount;

  @Enumerated(EnumType.STRING)
  private SourceType sourceType;

  private Long sourceId;

  private String customerInfo;

  private String managerNotes;


}
