package com.tabletopia.restaurantservice.domain.reservation.controller;//package com.tabletopia.realtimeservice.domain.reservation.controller;
//
//
//import com.tabletopia.realtimeservice.domain.reservation.dto.AvailableTimesResponse;
//import com.tabletopia.realtimeservice.domain.reservation.dto.ConnectionMessage;
//import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionInfo;
//import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionRequest;
//import com.tabletopia.realtimeservice.domain.reservation.dto.TableSelectionResult;
//import com.tabletopia.realtimeservice.domain.reservation.dto.TableTimeSlotStatus;
//import com.tabletopia.realtimeservice.domain.reservation.service.ReservationService;
//import com.tabletopia.realtimeservice.dto.OpeningHourResponse;
//import com.tabletopia.realtimeservice.dto.RestaurantTableDto;
//import com.tabletopia.realtimeservice.dto.TimeSlotResponse;
//import com.tabletopia.realtimeservice.feign.RestaurantServiceClient;
//import java.time.LocalDate;
//import java.time.LocalDateTime;
//import java.time.format.DateTimeFormatter;
//import java.util.ArrayList;
//import java.util.HashMap;
//import java.util.List;
//import java.util.Map;
//import java.util.Set;
//import java.util.concurrent.ConcurrentHashMap;
//import lombok.RequiredArgsConstructor;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.messaging.handler.annotation.DestinationVariable;
//import org.springframework.messaging.handler.annotation.MessageMapping;
//import org.springframework.messaging.handler.annotation.SendTo;
//import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
//import org.springframework.stereotype.Controller;
//import org.springframework.web.bind.annotation.RequestMapping;
//
///**
// * 예약 페이지의 실시간 테이블 상태 지원을 위한 웹소켓 컨트롤러
// *
// * @author 김예진
// * @since 2025-09-25
// */
//@Slf4j
//@Controller
//@RequestMapping("/api/realtime")
//@RequiredArgsConstructor
//public class WebSocketController {
//
//  private final ReservationService reservationService;
//  private final RestaurantServiceClient restaurantServiceClient;
//
//  /**
//   * 레스토랑별 시간대별 테이블 선점 상태
//   * <p>
//   * Key: restaurantId_tableId_timeSlot, Value: TableSelectionInfo Key
//   * 예시: "1_3_2025-09-25T12:00": 1번 레스토랑, 3번 테이블, 18:00 시간대
//   */
//  private final Map<String, TableSelectionInfo> selectedTables = new ConcurrentHashMap<>();
//
//  /**
//   * 레스토랑별 테이블 정보
//   * <p>
//   * key: restaurantId, Value: RestaurantTableDto 레스토랑 테이블 dto 리스트
//   */
//  private final Map<Long, List<RestaurantTableDto>> restaurantTablesCache = new ConcurrentHashMap<>();
//
//  /**
//   * 레스토랑별 운영시간 정보
//   * <p>
//   * Key: restaurantId, Value: OpeningHourResponse 레스토랑 운영시간 dto 리스트
//   */
//  private final Map<Long, List<OpeningHourResponse>> openingHoursCache = new ConcurrentHashMap<>();
//
//  /**
//   * 레스토랑의 요일별 타임슬롯 정보
//   * <p>
//   * Key: restaurantId_dayOfWeek, Value: TimeSlotResponse 레스토랑 요일별 운영시간 dto 리스트
//   */
//  private final Map<String, List<TimeSlotResponse>> timeSlotsCache = new ConcurrentHashMap<>();
//
//  /**
//   * 현재 접속 중인 사용자 목록
//   * <p>
//   * Key: restaurantId, Value: 접속자 set
//   */
//  private final Map<Long, Set<String>> connectedUsers = new ConcurrentHashMap<>();
//
//  /**
//   * 테이블 예약 대기자 목록
//   * <p>
//   * Key: restaurantId, Value: 예약 대기자 id
//   */
//  private final Map<Long, List<Long>> waitingQueue = new ConcurrentHashMap<>();
//
//
//  private final ReservationService reservationService;
//
//
//  /**
//   * 레스토랑 테이블 예약 접속 처리
//   * @author 김예진
//   * @since 2025-09-25
//   *
//   * @param restaurantId 레스토랑 id
//   * @param message 접속 메시지
//   * @return 현재 접속 중인 사용자 목록
//   */
//  @MessageMapping("/reservation/{restaurantId}/connect")
//  @SendTo("/topic/reservation/{restaurantId}/table-status")
//  private Set<String> connectToReservation(
//      @DestinationVariable Long restaurantId,
//      ConnectionMessage message) {
//    // STOMP의 @DestinationVariable = HTTP에서 파라미터 값을 받아오기 위해 사용한 @PathVariable
//    log.debug("레스토랑 {}에 사용자 {} 접속 요청", restaurantId, message.getUserEmail());
//
//    // 접속자 목록에 추가
//    connectedUsers
//        .computeIfAbsent(restaurantId, k -> ConcurrentHashMap.newKeySet())
//        .add(message.getUserEmail());
//
//    // 레스토랑 정보 초기화
//    initRestaurantData(restaurantId);
//
//    return connectedUsers.get(restaurantId);
//  }
//
//
//  /**
//   * 테이블 선택 (빨간불로 변경)
//   * 사용자가 테이블을 클릭했을 때 호출
//   *
//   * @param restaurantId 레스토랑 ID
//   * @param tableId 테이블 ID
//   * @param request 선택 요청 정보
//   * @param headerAccessor 웹소켓 세션 정보
//   * @return 선택 결과 + 모든 접속자에게 상태 변경 브로드캐스트
//   */
//  @MessageMapping("/restaurant/{restaurantId}/table/{tableId}/select")
//  @SendTo("/topic/restaurant/{restaurantId}/tables/status")
//  public TableSelectionResult selectTable(@DestinationVariable Long restaurantId,
//      @DestinationVariable String tableId,
//      TableSelectionRequest request,
//      SimpMessageHeaderAccessor headerAccessor) { // 웹소켓 메시지 헤더 정보
//
//    String sessionId = headerAccessor.getSessionId();
//    String userEmail = request.getUserEmail();
//
//    log.debug("테이블 선택 요청: 레스토랑 {}, 테이블 {}, 사용자 {}", restaurantId, tableId, userEmail);
//
//    try {
//      // 레스토랑, 테이블, 날짜, 시간 키 생성
//      String selectionKey = createSelectionKey(restaurantId, tableId, request.getDate(), request.getTime());
//
//      // 선점된 테이블에 있는지 조회
//      TableSelectionInfo existingSelection = selectedTables.get(selectionKey);
//      // 다른 사용자가 이미 선점한 테이블인 경우
//      if (existingSelection != null && !existingSelection.getSessionId().equals(sessionId)) {
////        if (!isSelectionExpired(existingSelection)) {
//          return TableSelectionResult.failure(tableId, "다른 사용자가 선택한 테이블입니다.");
////        }
//      }
//
//      // 실제 예약/사용 상태 확인
//      String timeSlot = formatTimeSlot(request.getDate(), request.getTime());
//      if (reservationService.isTableReserved(restaurantId, Long.valueOf(tableId), timeSlot)) {
//        return TableSelectionResult.failure(tableId, "이미 예약된 테이블입니다.");
//      }
//
//      // 새로운 선점 생성 (5분간 유효)
//      TableSelectionInfo selection = new TableSelectionInfo(
//          tableId,
//          userId,
//          sessionId,
//          request.getCustomerName(),
//          LocalDateTime.now(),
//          LocalDateTime.now().plusMinutes(5), // 5분 후 만료
//          TableSelectionStatus.SELECTED
//      );
//
//      // 선점 정보 저장
//      selectedTables.put(selectionKey, selection);
//
//      log.info("테이블 선점 성공: {} → 빨간불 변경", selectionKey);
//
//      // 성공 결과와 함께 업데이트된 테이블 상태를 모든 사용자에게 브로드캐스트
//      return TableSelectionResult.success(tableId, "테이블이 선택되었습니다.", selection);
//
//    } catch (Exception e) {
//      log.error("테이블 선택 실패: restaurantId={}, tableId={}", restaurantId, tableId, e);
//      return TableSelectionResult.failure(tableId, "테이블 선택에 실패했습니다.");
//    }
//  }
//
//  /**
//   * 선점 키 생성: "restaurantId_tableId_date_time"
//   */
//  private String createSelectionKey(Long restaurantId, String tableId, String date, String time) {
//    return String.format("%d_%s_%s_%s", restaurantId, tableId, date, time);
//  }
//
//  /**
//   * 시간대 문자열 생성: "2025-09-26T18:00"
//   */
//  private String formatTimeSlot(String date, String time) {
//    return String.format("%sT%s", date, time);
//  }
//
//  // ================== 조짐
//
////
////
////
////
////
////
////
////
//////  /**
//////   * 특정 날짜의 예약 가능한 시간대 목록 조회
//////   * 프론트에서 날짜 선택 시 호출
//////   *
//////   * @author 김예진
//////   * @since 2025-09-25
//////   *
//////   * @param restaurantId 레스토랑 ID
//////   * @param date 날짜 yyyy-MM-dd
//////   * @return 예약 가능한 시간대 목록
//////   */
//////  @MessageMapping("/restaurant/{restaurantId}/available-times")
//////  @SendTo("/topic/restaurant/{restaurantId}/available-times")
//////  public void getAvailableTimes(
//////      @DestinationVariable Long restaurantId,
//////      String date){
//////    log.debug("예약 가능 시간 조회: 레스토랑 {}, 날짜 {}", restaurantId, date);
//////
//////    try {
//////      // 메모리에 레스토랑의 테이블과 운영시간이 불러와져있지 않다면 초기화
//////      if (!restaurantTablesCache.containsKey(restaurantId) || !openingHoursCache.containsKey(restaurantId)) {
//////        initRestaurantData(restaurantId);
//////      }
//////
//////      // 현재 레스토랑의 운영시간 불러오기
//////      List<OpeningHourResponse> weeklyHours = openingHoursCache.get(restaurantId);
//////
//////      // 요일 계산 (0: 일요일 ~ 6: 토요일)
//////      int dayOfWeek = calculateDayOfWeek(date);
//////
//////      log.debug("선택한 날짜 {}는 {}요일입니다. (0: 일요일 ~ 6: 토요일)", date, dayOfWeek);
//////
//////      // 해당 요일의 운영시간 확인
//////      OpeningHourResponse dayHours = weeklyHours.stream() // 운영시간 전체 리스트
//////          .filter(hour -> hour.getDayOfWeek() == dayOfWeek) // 계산한 요일과 같은 요일만 필터링
//////          .findFirst() // 첫 번째 값 가져오기
//////          .orElse(null);
//////
//////    } catch (Exception e) {
//////    }
//////  }
////
////
//  /**
//   * 레스토랑 테이블 + 운영시간 데이터 초기화
//   *
//   * @author 김예진
//   * @since 2025-09-25
//   */
//  private void initRestaurantData(Long restaurantId) {
//    // 이미 테이블이 초기화되어있는 레스토랑은 스킵
//    if (restaurantTablesCache.containsKey(restaurantId)) {
//      log.debug("레스토랑 {}는 이미 로드되어있습니다.", restaurantId);
//      return;
//    }
//
//    try {
//      // 테이블 정보 조회
//      List<RestaurantTableDto> tables = restaurantServiceClient.getRestaurantTables(restaurantId);
//      restaurantTablesCache.put(restaurantId, tables);
//
//      // 요일 별 운영시간 정보 조회
//      List<OpeningHourResponse> weeklyHours = restaurantServiceClient.getOpeningHours(restaurantId);
//      openingHoursCache.put(restaurantId, weeklyHours);
//
//      // 요일별 타임슬롯 정보 조회
//      for (int dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
//        List<TimeSlotResponse> slots = restaurantServiceClient.getSlots(restaurantId, dayOfWeek);
//        String key = createTimeSlotKey(restaurantId, dayOfWeek);
//        timeSlotsCache.put(key, slots);
//
//        log.debug("레스토랑 {} 요일 {} 타임슬롯 {}개 저장 완료", restaurantId, dayOfWeek, slots.size());
//      }
//
//      log.debug("레스토랑 {} 데이터 초기화. 테이블 {}개, 운영시간 {}개 요일", restaurantId, tables.size(), weeklyHours.size());
//
//    } catch (Exception e) {
//      // TODO 예외처리 추가
//    }
//  }
////
////  /**
////   * 타임슬롯 키 생성
////   * @author 김예진
////   * @since 2025-09-26
////   *
////   * @return restaurantId_dayOfWeek
////   */
////  private static String createTimeSlotKey(Long restaurantId, int dayOfWeek) {
////    return String.format("%d_%d", restaurantId, dayOfWeek);
////  }
////
////  /**
////   * 특정 날짜의 테이블 상태 조회
////   *
////   * @author 김예진
////   * @since 2025-09-26
////   */
////  public void getTableStatus(
////      @DestinationVariable Long restaurantId,
////      @DestinationVariable String date // YYYY-MM-DD
////  ){
////    // 레스토랑의 테이블들 조회
////    List<RestaurantTableDto> tables = restaurantTablesCache.get(restaurantId);
////
////    // 레스토랑의 운영시간 조회
////    List<OpeningHourResponse> hours = openingHoursCache.get(restaurantId);
////
////    // 요일 계산
////    int dayOfWeek = calculateDayOfWeek(date);
////    log.debug("요청한 요일 - {} 요일", dayOfWeek);
////
////    // 해당 요일의 타임슬롯 조회
////    String timeSlotKey = createTimeSlotKey(restaurantId, dayOfWeek);
////    List<TimeSlotResponse> slots = timeSlotsCache.get(timeSlotKey);
////
////    // 각 테이블별, 시간대별 상태 조회
////    // Map<tableId, Map<시간대, 상태정보>>
////    Map<String, Map<String, TableTimeSlotStatus>> tableStatusMap = new HashMap<>();
////    // 시간대 목록
////    List<String> timeSlotStrings = new ArrayList<>();
////
////    // 해당 레스토랑의 테이블들 순회
////    for (RestaurantTableDto table : tables){
////      String tableId = "T"+table.getId();
////      Map<String, TableTimeSlotStatus> timeSlotStatuses = new HashMap<>();
////
////      // 요일의 예약 시간대 순회
////      for (TimeSlotResponse slot: slots){
////        String timeSlotString = formatTimeSlot(date, slot.getStartTime()); // 날짜T시간
////        // 시간대 목록에 없는 경우에만 추가
////        if (!timeSlotStrings.contains(timeSlotString)){
////          timeSlotStrings.add(timeSlotString);
////        }
////
////        String selectionKey = createSelectionKey(restaurantId, tableId, timeSlotString);
////        TableSelectionInfo selection = tableSelections.get(selectionKey);
////
////        TableTimeSlotStatus status = new TableTimeSlotStatus();
////        status.setTimeSlot(timeSlotString);
////        status.setTableId(tableId);
////        status.setTableName(table.getName());
////        status.setMinCapacity(table.getMinCapacity());
////        status.setMaxCapacity(table.getMaxCapacity());
////
////
////      }
////    }
////
////
////
////
//////    Map<String, Map<String, TableTimeSlotStatus>> tableStatusMap = new HashMap<>();
////
//////    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm");
//////
//////    for (TimeSlotResponse slot : slots) {
//////      LocalDateTime reservationAt = LocalDateTime.parse(date + "T" + slot.getStartTime(), formatter);
//////
//////      List<Reservation> reservations = reservationService.getReservationsAt(restaurantId, reservationAt);
//////    }
////  }
////
////  /**
////   * 타임슬롯 캐시 키 생성
////   */
////  private String createTimeslotCacheKey(Long restaurantId, int dayOfWeek) {
////    return String.format("%d_%d", restaurantId, dayOfWeek);
////  }
////
////  /**
////   * TimeSlotResponse를 문자열로 포맷
////   */
////  private String formatTimeSlot(String date, String startTime) {
////    return String.format("%sT%s", date, startTime);
////  }
////
////  /**
////   * 날짜의 요일(숫자)을 계산하는 메서드
////   *
////   * @param dateStr yyyy-MM-dd
////   * @return 0: 일요일 ~ 6: 월요일
////   */
////  public int calculateDayOfWeek(String dateStr){
////    // 문자열을 LocalDate로 변환
////    DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
////    LocalDate date = LocalDate.parse(dateStr, formatter);
////
////    // 요일 계산
////    return (date.getDayOfWeek().getValue() % 7);
////  }
//}
