package com.tabletopia.realtimeservice.domain.reservation.controller;


import com.tabletopia.realtimeservice.domain.reservation.dto.ConnectionMessage;
import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionInfo;
import com.tabletopia.realtimeservice.domain.reservation.entity.Reservation;
import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
import com.tabletopia.realtimeservice.dto.OpeningHourResponse;
import com.tabletopia.realtimeservice.dto.RestaurantTableDto;
import com.tabletopia.realtimeservice.dto.TimeSlotResponse;
import com.tabletopia.realtimeservice.feign.RestaurantServiceClient;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * 예약 페이지의 실시간 테이블 상태 지원을 위한 웹소켓 컨트롤러
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Slf4j
@Controller
@RequestMapping("/api/realtime")
@RequiredArgsConstructor
public class WebSocketController {

  private final RestaurantServiceClient restaurantServiceClient;

  /**
   * 레스토랑별 시간대별 테이블 선점 상태
   * <p>
   * Key: restaurantId_tableId_timeSlot, Value: TableSelectionInfo Key
   * 예시: "1_3_2025-09-25T12:00": 1번 레스토랑, 3번 테이블, 18:00 시간대
   */
  private final Map<String, TableSelectionInfo> timeSlotTable = new ConcurrentHashMap<>();

  /**
   * 레스토랑별 테이블 정보
   * <p>
   * key: restaurantId, Value: RestaurantTableDto 레스토랑 테이블 dto 리스트
   */
  private final Map<Long, List<RestaurantTableDto>> restaurantTables = new ConcurrentHashMap<>();

  /**
   * 레스토랑별 운영시간 정보
   * <p>
   * Key: restaurantId, Value: OpeningHourResponse 레스토랑 운영시간 dto 리스트
   */
  private final Map<Long, List<OpeningHourResponse>> openingHours = new ConcurrentHashMap<>();

  /**
   * 레스토랑의 요일별 타임슬롯 정보
   * <p>
   * Key: restaurantId_dayOfWeek, Value: TimeSlotResponse 레스토랑 요일별 운영시간 dto 리스트
   */
  private final Map<String, List<TimeSlotResponse>> timeSlots = new ConcurrentHashMap<>();

  /**
   * 현재 접속 중인 사용자 목록
   * <p>
   * Key: restaurantId, Value: 접속자 set
   */
  private final Map<Long, Set<String>> connectedUsers = new ConcurrentHashMap<>();

  /**
   * 테이블 예약 대기자 목록
   * <p>
   * Key: restaurantId, Value: 예약 대기자 id
   */
  private final Map<Long, List<Long>> waitingQueue = new ConcurrentHashMap<>();
  private final ReservationService reservationService;


  /**
   * 레스토랑 테이블 예약 접속 처리
   *
   * @author 김예진
   * @since 2025-09-25
   */
  @MessageMapping("/reservation/{restaurantId}/connect")
  @SendTo("/topic/reservation/{restaurantId}/table-status")
  private Set<String> connectToReservation(
      @DestinationVariable Long restaurantId,
      ConnectionMessage message) {
    // STOMP의 @DestinationVariable = HTTP에서 파라미터 값을 받아오기 위해 사용한 @PathVariable
    log.debug("레스토랑 {}에 사용자 {} 접속 요청", restaurantId, message.getUserEmail());

    connectedUsers
        .computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet())
        .add(message.getUserEmail());

    // 레스토랑 정보 초기화
    initRestaurantTables(restaurantId);

    return connectedUsers.get(restaurantId);
  }

  /**
   * 레스토랑 테이블 + 운영시간 데이터 초기화
   *
   * @author 김예진
   * @since 2025-09-25
   */
  private void initRestaurantTables(Long restaurantId) {
    // 이미 테이블이 초기화되어있는 레스토랑은 스킵
    if (restaurantTables.containsKey(restaurantId)) {
      log.debug("레스토랑 {}는 이미 로드되어있습니다.", restaurantId);
      return;
    }

    try {
      // 테이블 정보 조회
      List<RestaurantTableDto> tables = restaurantServiceClient.getRestaurantTables(restaurantId);
      restaurantTables.put(restaurantId, tables);

      // 요일 별 운영시간 정보 조회
      List<OpeningHourResponse> weeklyHours = restaurantServiceClient.getOpeningHours(restaurantId);
      openingHours.put(restaurantId, weeklyHours);

      // 요일별 타임슬롯 정보 조회
      for (int dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
        List<TimeSlotResponse> slots = restaurantServiceClient.getSlots(restaurantId, dayOfWeek);
        String key = createTimeSlotKey(restaurantId, dayOfWeek);
        timeSlots.put(key, slots);

        log.debug("레스토랑 {} 요일 {} 타임슬롯 {}개 저장 완료", restaurantId, dayOfWeek, slots.size());
      }

      log.debug("레스토랑 {} 데이터 초기화. 테이블 {}개, 운영시간 {}개 요일", restaurantId, tables.size(), weeklyHours.size());

    } catch (Exception e) {
      // TODO 예외처리 추가
    }
  }

  /**
   * 타임슬롯 키 생성
   * @author 김예진
   * @since 2025-09-26
   *
   * @return restaurantId_dayOfWeek
   */
  private static String createTimeSlotKey(Long restaurantId, int dayOfWeek) {
    return String.format("%d_%d", restaurantId, dayOfWeek);
  }

  /**
   * 특정 날짜의 테이블 상태 조회
   *
   * @author 김예진
   * @since 2025-09-26
   */
  public void getTableStatus(
      @DestinationVariable Long restaurantId,
      @DestinationVariable String date // YYYY-MM-DD
  ){
    // 레스토랑의 테이블들 조회
    List<RestaurantTableDto> tables = restaurantTables.get(restaurantId);

    // 레스토랑의 운영시간 조회
    List<OpeningHourResponse> hours = openingHours.get(restaurantId);

    // 요일 계산
    int dayOfWeek = getDayOfWeek(date);
    log.debug("요청한 요일 - {} 요일", dayOfWeek);

    // 해당 요일의 타임슬롯 조회
    String timeSlotKey = createTimeSlotKey(restaurantId, dayOfWeek);
    List<TimeSlotResponse> slots = timeSlots.get(timeSlotKey);

    // 각 테이블별, 시간대별 상태 조회
//    Map<String, Map<String, TableTimeSlotStatus>> tableStatusMap = new HashMap<>();

//    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
//
//    for (TimeSlotResponse slot : slots) {
//      LocalDateTime reservationAt = LocalDateTime.parse(date + "T" + slot.getStartTime(), formatter);
//
//      List<Reservation> reservations = reservationService.getReservationsAt(restaurantId, reservationAt);
//    }
  }

  /**
   * 날짜의 요일(숫자)을 계산하는 메서드
   * 
   * @param dateStr yyyy-MM-dd
   * @return 0: 일요일 ~ 6: 월요일
   */
  public int getDayOfWeek(String dateStr){
    // 문자열을 LocalDate로 변환
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    LocalDate date = LocalDate.parse(dateStr, formatter);

    // 요일 계산
    return (date.getDayOfWeek().getValue() % 7);
  }
}
