package com.tabletopia.restaurantservice.domain.waiting.repository;

import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import jakarta.persistence.LockModeType;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
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
      "WHERE w.restaurant.id = :restaurantId " +
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

  //내 앞에 대기 중인 팀 수 계산
  @Query("SELECT COUNT(w) FROM Waiting w " +
      "WHERE w.restaurant.id = :restaurantId " +
      "AND w.waitingState = 'WAITING' " +
      "AND w.waitingNumber < :myWaitingNumber " +
      "AND DATE(w.createdAt) = CURRENT_DATE") //오늘 날짜인지 검사
  Integer countTeamsAhead(@Param("restaurantId") Long restaurantId, @Param("myWaitingNumber") Integer myWaitingNumber);

  //사용자의 모든 웨이팅 내역 조회
  @Query("SELECT w FROM Waiting w " +
      "JOIN FETCH w.user " +
      "JOIN FETCH w.restaurant " +
      "WHERE w.user.id = :userId")
  Page<Waiting> findByUserId(
      @Param("userId") Long userId,
      Pageable pageable);

  //동시에 웨이팅 할 경우 lock을 통해 웨이팅 등록 권한 획득
  @Lock(LockModeType.PESSIMISTIC_WRITE)
  @Query("SELECT MAX(w.waitingNumber) FROM Waiting w " +
      "WHERE w.restaurant.id = :restaurantId " +
      "AND DATE(w.createdAt) = CURRENT_DATE")
  Integer findMaxWaitingNumberByRestaurantIdTodayWithLock(
      @Param("restaurantId") Long restaurantId);

  // 중복 확인용 메서드
  boolean existsByRestaurantIdAndUserIdAndWaitingStateIn(
      Long restaurantId,
      Long userId,
      List<WaitingState> waitingState);


  //특정 범위의 웨이팅 조회 (미루기용)
  @Query("SELECT w FROM Waiting w " +
      "JOIN FETCH w.user " +
      "WHERE w.restaurant.id = :restaurantId " +
      "AND w.waitingState = :state " +
      "AND w.waitingNumber > :startNumber " +
      "AND w.waitingNumber <= :endNumber " +
      "AND w.createdAt >= :todayStart " +
      "ORDER BY w.waitingNumber ASC")
  List<Waiting> findWaitingsBetweenNumbers(
      @Param("restaurantId") Long restaurantId,
      @Param("state") WaitingState state,
      @Param("startNumber") Integer startNumber,
      @Param("endNumber") Integer endNumber,
      @Param("todayStart") LocalDateTime todayStart
  );



}
