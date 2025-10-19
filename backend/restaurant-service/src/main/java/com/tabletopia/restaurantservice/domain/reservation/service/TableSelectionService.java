package com.tabletopia.restaurantservice.domain.reservation.service;

import com.tabletopia.restaurantservice.domain.reservation.dto.TableSelectionInfo;

import java.time.LocalDateTime;
import java.util.Set;
import java.util.concurrent.TimeUnit;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

/**
 * Redis 기반 테이블 선점 관리 서비스
 *
 * @author 김예진
 * @since 2025-10-11
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class TableSelectionService {

  private final RedisTemplate<String, Object> redisTemplate;

  // Redis Key 접두사
  private static final String TABLE_SELECTION_PREFIX = "table:selection:";
  private static final String CONNECTED_USERS_PREFIX = "connected:users:";
  private static final String RESERVATION_CACHE_PREFIX = "reservation:cache:";

  // TTL 설정
  private static final long TABLE_SELECTION_TTL = 5; // 5분
  private static final long CONNECTED_USERS_TTL = 30; // 30분
  private static final long RESERVATION_CACHE_TTL = 10; // 10분

  // =============== 테이블 선점 정보 관리 =============== //

  /**
   * 테이블 선점 시도를 원자적 연산(오직 하나의 요청만 성공(키 생성)하고 나머지는 실패)으로 수행
   * SETNX(SET if Not eXists) 방식으로 동시성 제어
   *
   * @param selectionKey 선점키
   * @param tableSelectionInfo 선점정보
   * @return true: 선점 성공, false: 이미 선점됨
   * @author 김예진
   * @since 2025-10-11
   */
  public boolean trySelectTable(String selectionKey, TableSelectionInfo tableSelectionInfo){
    // Redis에 저장될 최종 키 생성
    String redisKey = TABLE_SELECTION_PREFIX + selectionKey;

    //  Redis SETNX + TTL을 한 번에 실행 (원자적 연산)
    try {
      Boolean success = redisTemplate.opsForValue().setIfAbsent( // 키가 존재하지 않을 때만 저장
          redisKey, // 저장할 키
          tableSelectionInfo, // 저장할 값
          TABLE_SELECTION_TTL, // 만료 시간
          TimeUnit.MINUTES // 시간 단위
      );

      if (Boolean.TRUE.equals(success)){ // null 체크
        // 선점 성공: Redis에 키가 없으므로 새로 저장
        log.debug("선점 성공: tableId={}, sessionId={}", tableSelectionInfo.getTableId(), tableSelectionInfo.getSessionId());
        return true;
      } else{
        // 선점 실패: Redis에 이미 다른 유저가 먼저 선점한 키가 존재함
        log.debug("선점 실패 (이미 선점됨): tableId={}", tableSelectionInfo.getTableId());
        return false;
      }
    } catch (Exception e) {
      // TODO Redis 연결 오류 등의 예외 처리 추가
      log.error("선점 시도 중 오류: {}", redisKey, e);
      return false; // 오류로 선점 실패
    }
  }

  /**
   * 테이블 선점 정보 저장
   * <p>
   * 예약 완료 후 상태 변경을 위해 기존 값이 있어도 덮어쓰기가 이루어짐
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void saveTableSelection(String selectionKey, TableSelectionInfo selectionInfo) {
    // Redis에 저장될 키 생성
    String redisKey = TABLE_SELECTION_PREFIX + selectionKey;

    try {
      redisTemplate.opsForValue().set( // SET으로 덮어쓰기 (예약 완료한 경우 상태를 CONFIRMED로 변경)
          redisKey,
          selectionInfo,
          TABLE_SELECTION_TTL,
          TimeUnit.MINUTES
      );
      log.debug("Redis 저장: {} → {}", redisKey, selectionInfo);
    } catch (Exception e) {
      log.error("Redis 저장 실패: {}", redisKey, e);
    }
  }

  /**
   * 테이블 선점 정보 조회
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public TableSelectionInfo getTableSelection(String selectionKey) {
    String redisKey = TABLE_SELECTION_PREFIX + selectionKey;
    log.debug("선점조회 시작");

    try {
      Object value = redisTemplate.opsForValue().get(redisKey);

      if (value instanceof TableSelectionInfo) {
        TableSelectionInfo info = (TableSelectionInfo) value;
        log.debug("Redis 조회: {} -> {}", redisKey, info);
        return info;
      }

      log.debug("Redis 조회: {} -> null", redisKey);
      return null;
    } catch (Exception e) {
      log.error("Redis 조회 실패: {}", redisKey, e);
      return null;
    }
  }

  /**
   * 테이블 선점 정보 삭제
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void deleteTableSelection(String selectionKey) {
    String redisKey = TABLE_SELECTION_PREFIX + selectionKey;

    try {
      redisTemplate.delete(redisKey);
      log.debug("Redis 삭제: {}", redisKey);
    } catch (Exception e) {
      log.error("Redis 삭제 실패: {}", redisKey, e);
    }
  }

  /**
   * 테이블 선점 만료 여부 확인
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public boolean isSelectionExpired(TableSelectionInfo selection) {
    if (selection == null) {
      return true;
    }
    return LocalDateTime.now().isAfter(selection.getExpiryTime());
  }

  // =============== 접속 중인 사용자 관리 =============== //

  /**
   * 레스토랑에 접속한 사용자 추가
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void addConnectedUser(Long restaurantId, String userEmail, String sessionId) {
    String redisKey = CONNECTED_USERS_PREFIX + restaurantId;

    try {
      // Set에 추가 (중복 방지)
//      redisTemplate.opsForSet().add(redisKey, sessionId, userEmail);

      // Hash에 추가
      redisTemplate.opsForHash().put(redisKey, sessionId, userEmail);

      // TTL 갱신 (30분)
      redisTemplate.expire(redisKey, CONNECTED_USERS_TTL, TimeUnit.MINUTES);

      log.debug("접속자 추가: restaurantId={}, sessionId={}", restaurantId, sessionId);
    } catch (Exception e) {
      log.error("접속자 추가 실패: restaurantId={}, sessionId={}", restaurantId, sessionId, e);
    }
  }

  /**
   * 레스토랑에서 접속 해제한 사용자 제거
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void removeConnectedUser(Long restaurantId, String sessionId) {
    String redisKey = CONNECTED_USERS_PREFIX + restaurantId;

    try {
      redisTemplate.opsForHash().delete(redisKey, sessionId);
      log.debug("접속자 제거: restaurantId={}, sessionId={}", restaurantId, sessionId);
    } catch (Exception e) {
      log.error("접속자 제거 실패: restaurantId={}, sessionId={}", restaurantId, sessionId, e);
    }
  }

  /**
   * 레스토랑의 전체 접속자 목록 조회 (세션ID 목록)
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public Set<Object> getConnectedUsers(Long restaurantId) {
    String redisKey = CONNECTED_USERS_PREFIX + restaurantId;

    try {
      Set<Object> sessionIds = redisTemplate.opsForHash().keys(redisKey);
      log.debug("접속자 조회: restaurantId={}, count={}", restaurantId, sessionIds != null ? sessionIds.size() : 0);
      return sessionIds;
    } catch (Exception e) {
      log.error("접속자 조회 실패: restaurantId={}", restaurantId, e);
      return Set.of();
    }
  }

  /**
   * 레스토랑의 접속자 수 조회
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public Long getConnectedUsersCount(Long restaurantId) {
    String redisKey = CONNECTED_USERS_PREFIX + restaurantId;

    try {
      Long count = redisTemplate.opsForHash().size(redisKey);
      return count != null ? count : 0L;
    } catch (Exception e) {
      log.error("접속자 수 조회 실패: restaurantId={}", restaurantId, e);
      return 0L;
    }
  }

  // =============== 3. 예약 확정 정보 캐싱 =============== //

  /**
   * 예약 확정 정보 캐시 저장
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void cacheReservationStatus(Long restaurantId, Long tableId, String timeSlot, boolean isReserved) {
    String redisKey = String.format("%s%d:%d:%s", RESERVATION_CACHE_PREFIX, restaurantId, tableId, timeSlot);

    try {
      redisTemplate.opsForValue().set(redisKey, isReserved, RESERVATION_CACHE_TTL, TimeUnit.MINUTES);
      log.debug("예약 캐시 저장: {} → {}", redisKey, isReserved);
    } catch (Exception e) {
      log.error("예약 캐시 저장 실패: {}", redisKey, e);
    }
  }

  /**
   * 예약 확정 정보 캐시 조회
   *
   * @author 김예진
   * @since 2025-10-11
   * @return null이면 캐시 없음 (DB 조회 필요), true/false면 캐시된 값
   */
  public Boolean getCachedReservationStatus(Long restaurantId, Long tableId, String timeSlot) {
    String redisKey = String.format("%s%d:%d:%s", RESERVATION_CACHE_PREFIX, restaurantId, tableId, timeSlot);

    try {
      Object value = redisTemplate.opsForValue().get(redisKey);

      if (value instanceof Boolean) {
        log.debug("예약 캐시 조회 (캐시 히트): {} -> {}", redisKey, value);
        return (Boolean) value;
      }

      log.debug("예약 캐시 조회 (캐시 미스): {}", redisKey);
      return null; // 캐시 없음
    } catch (Exception e) {
      log.error("예약 캐시 조회 실패: {}", redisKey, e);
      return null;
    }
  }

  /**
   * 예약 캐시 삭제 (예약 완료/취소 시)
   *
   * @author 김예진
   * @since 2025-10-11
   */
  public void deleteCachedReservationStatus(Long restaurantId, Long tableId, String timeSlot) {
    String redisKey = String.format("%s%d:%d:%s", RESERVATION_CACHE_PREFIX, restaurantId, tableId, timeSlot);

    try {
      redisTemplate.delete(redisKey);
      log.debug("예약 캐시 삭제: {}", redisKey);
    } catch (Exception e) {
      log.error("예약 캐시 삭제 실패: {}", redisKey, e);
    }
  }
}
