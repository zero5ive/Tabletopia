package com.tabletopia.restaurantservice.domain.waiting.repository;

import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import java.time.LocalDateTime;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

/**
 * 웨이팅 레파지토리
 *
 * @author 성유진
 * @since 2025-09-26
 */

public interface WaitingRepository extends JpaRepository<Waiting, Long> {

  //하루가 지나면 watitingnumber가 1부터 시작하게
  @Query("SELECT MAX(w.waitingNumber) FROM Waiting w " +
      "WHERE w.restaurantId = :restaurantId " +
      "AND DATE(w.createdAt) = CURRENT_DATE")
  Integer findMaxWaitingNumberByRestaurantIdToday(@Param("restaurantId") Long restaurantId);

  //레스토랑  리스트 하루 지나면 초기화 되게
  Page<Waiting> findByRestaurantIdAndWaitingStateAndCreatedAtAfter(
      Long restaurantId,
      WaitingState waitingState,
      LocalDateTime createdAt,
      Pageable pageable);


  //웨이팅 취소
  Optional<Waiting> findByIdAndRestaurantId(Long id, Long restaurantId);
}
