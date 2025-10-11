package com.tabletopia.realtimeservice.domain.waiting.repository;

import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.enums.WaitingState;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

/**
 * 웨이팅 레파지토리
 *
 * @author 성유진
 * @since 2025-09-26
 */

public interface WaitingRepository extends JpaRepository<Waiting, Long> {

  //waiting number계산
  @Query("SELECT MAX(w.waitingNumber) FROM Waiting w WHERE w.restaurantId = :restaurantId")
  Integer findMaxWaitingNumberByRestaurantId(@Param("restaurantId") Long restaurantId);

  //레스토랑  리스트
  Page<Waiting> findByRestaurantIdAndWaitingState(Long restaurantId, WaitingState waitingState, Pageable pageable);

  //웨이팅 취소
  Optional<Waiting> findByIdAndRestaurantId(Long id, Long restaurantId);
}
