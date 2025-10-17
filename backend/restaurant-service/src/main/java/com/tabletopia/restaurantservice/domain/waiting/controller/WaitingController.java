package com.tabletopia.restaurantservice.domain.waiting.controller;

import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingEvent;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingRequest;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import com.tabletopia.restaurantservice.domain.waiting.service.WaitingNotificationService;
import com.tabletopia.restaurantservice.domain.waiting.service.WaitingService;
import java.time.LocalDateTime;
import java.util.Map;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

/**
 * 웨이팅 컨트롤러
 *
 * @author 성유진
 * @since 2025-09-26
 */

@Slf4j
@Controller
@RequiredArgsConstructor
public class WaitingController {

  private final WaitingService waitingService;
  private final WaitingNotificationService waitingNotificationService;
  private final SimpMessagingTemplate simpMessagingTemplate;

  /**
   * 웨이팅 오픈 상태 조회 REST API
   *
   * @author 성유진
   */
  @GetMapping("/api/waitings/status")
  @ResponseBody
  public Map<String, Boolean> getWaitingStatus(@RequestParam Long restaurantId) {
    boolean isOpen = waitingService.isWaitingOpen(restaurantId);
    log.debug("웨이팅 상태 조회 - restaurantId: {}, isOpen: {}", restaurantId, isOpen);
    return Map.of("isOpen", isOpen);
  }

  /**
   * 웨이팅 오픈
   *
   * @author 성유진
   */
  @MessageMapping("/waiting/open")
  public void open(@Payload Map<String, Long> payload){
    Long restaurantId = payload.get("restaurantId");
    log.debug("웨이팅 오픈 요청 - restaurantId: {}", restaurantId);

    // 웨이팅 오픈 상태 저장
    waitingService.openWaiting(restaurantId);

    WaitingEvent waitingEvent = new WaitingEvent();
    waitingEvent.setType("OPEN");
    waitingEvent.setContent("웨이팅 등록 가능");

    // 해당 레스토랑 채널로만 전송
    simpMessagingTemplate.convertAndSend(
        "/topic/restaurant/" + restaurantId + "/open",
        waitingEvent
    );

  }

  /**
   * 웨이팅 닫힘
   *
   * @author 성유진
   */
  @MessageMapping("/waiting/close")
  public void close(@Payload Map<String, Long> payload) {
    Long restaurantId = payload.get("restaurantId");

    log.debug("웨이팅 닫기 요청 - restaurantId: {}", restaurantId);

    // DB에 닫기 상태 저장
    waitingService.closeWaiting(restaurantId);

    WaitingEvent waitingEvent = new WaitingEvent();
    waitingEvent.setType("CLOSE");
    waitingEvent.setContent("웨이팅 등록 중단");

    // 해당 레스토랑 채널로만 전송
    simpMessagingTemplate.convertAndSend(
        "/topic/restaurant/" + restaurantId + "/close",
        waitingEvent
    );
  }

  /**
   * 웨이팅 등록
   *
   * @author 성유진
   */
  @MessageMapping("/waiting/regist")
  public void regist(@Payload WaitingRequest waitingRequest,
      SimpMessageHeaderAccessor accessor) {

    log.debug("웨이팅 등록 요청 받음");


    String sessionId = accessor.getSessionId();

    // 사용자 이메일을 저장할 변수 초기화
    String userEmail = null;

    // WebSocket 세션에서 인증 정보 확인
    if (accessor.getUser() != null) {
      // User 객체의 getName()은 일반적으로 username(이메일)을 반환
      // CONNECT 시 setUser()로 설정한 Authentication 객체가 반환됨
      userEmail = accessor.getUser().getName();

      log.debug("WebSocket 세션에서 인증 정보 확인: {}", userEmail);
    } else {
      // 인증 정보가 없는 경우 (JWT 토큰이 없거나 유효하지 않은 경우)
      log.warn("WebSocket 세션에 인증 정보가 없습니다. 세션 ID: {}", sessionId);
      // 이 경우 userEmail은 null로 남음
    }

    if (!waitingService.isWaitingOpen(waitingRequest.getRestaurantId())) {
      log.warn("웨이팅이 닫혀있음");

      WaitingEvent errorEvent = new WaitingEvent();
      errorEvent.setType("ERROR");
      errorEvent.setSender(waitingRequest.getUserId());
      errorEvent.setContent("현재 웨이팅 등록이 불가능합니다.");

      simpMessagingTemplate.convertAndSend("/topic/regist", errorEvent);
      return;
    }

    //  Service 호출 (엔티티 반환받음)
    Waiting waiting = waitingService.registerWaiting(
        waitingRequest.getRestaurantId(),
        waitingRequest.getUserId(),
        waitingRequest.getPeopleCount()
    );

    //  Controller에서 엔티티를 사용해서 응답 생성
    WaitingEvent waitingEvent = new WaitingEvent();
    waitingEvent.setType("REGIST");
    waitingEvent.setContent("웨이팅 등록");
    waitingEvent.setSender(waitingRequest.getUserId());
    waitingEvent.setContent(
        waiting.getRestaurantNameSnapshot() +  "에 " + waiting.getPeopleCount()+ "명 등록");

    simpMessagingTemplate.convertAndSend("/topic/regist", waitingEvent);

    log.debug("웨이팅 등록 완료 (세션: {}, userId: {})",
        sessionId, waitingRequest.getUserId());
  }

  /**
   * 웨이팅 리스트 조회
   *
   * @author 성유진
   */
  @GetMapping("/api/waitings/{restaurantId}")
  @ResponseBody
  public ResponseEntity<Page<WaitingResponse>> getList(@PathVariable Long restaurantId,
      @RequestParam String status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    // String을 Enum으로 변환
    WaitingState waitingState = WaitingState.valueOf(status);

    Page<WaitingResponse> waitingList = waitingService.getWaitingList(restaurantId, waitingState, pageable);

    return  ResponseEntity.ok(waitingList);
  }

  /**
   * 웨이팅 취소
   *
   * @author 성유진
   */
  @PutMapping("/api/waitings/{id}/cancel")
  @ResponseBody
  public ResponseEntity<String>cancelWaiting(@PathVariable Long id, @RequestParam Long restaurantId) {

    waitingService.cancelWaiting(id, restaurantId);
    simpMessagingTemplate.convertAndSend("/topic/cancel",
        Map.of("type", "CANCEL","id", id, "restaurantId", restaurantId,"timestamp", LocalDateTime.now()));

    return ResponseEntity.ok("웨이팅이 취소되었습니다.");
  }

  /**
   * 웨이팅 호출
   *
   * @author 서예닮
   * @since 2025-10-13
   */
  //웨이팅 호출
  @PutMapping("/api/waitings/{id}/called")
  @ResponseBody
  public ResponseEntity<String>callWaiting(@PathVariable Long id, @RequestParam Long restaurantId) {
    Waiting  waiting  =waitingService.callWaiting(id, restaurantId);

    waitingNotificationService.notifyWaitingStatusChange(waiting,restaurantId,"/topic/call");

    return ResponseEntity.ok("웨이팅이 호출되었습니다.");
  }

  //웨이팅 착석
  @PutMapping("/api/waitings/{id}/seated")
  @ResponseBody
  public  ResponseEntity<String> seatedWaiting(@PathVariable Long id, @RequestParam Long restaurantId){
    Waiting  waiting  =waitingService.seatedWaiting(id, restaurantId);

    waitingNotificationService.notifyWaitingStatusChange(waiting,restaurantId,"/topic/seated");

    return ResponseEntity.ok("착석되었습니다.");
  }

  /**
   * 내 앞에 대기 중인 팀 수 조회
   *
   * @author 서예닮
   * @since 2025-10-14
   */
  @GetMapping("/api/waitings/teams-ahead")
  @ResponseBody
  public ResponseEntity<Map<String, Integer>> getTeamsAhead(
      @RequestParam Long restaurantId,
      @RequestParam Integer waitingNumber) {
    Integer teamsAhead = waitingService.getTeamsAheadCount(restaurantId, waitingNumber);
    return ResponseEntity.ok(Map.of("teamsAhead", teamsAhead));
  }

  /**
   * 사용자의 웨이팅 내역 조회 (앞 대기팀 수 포함)
   *
   * @author 서예닮
   * @since 2025-10-15
   */
  @GetMapping("/api/waitings/user/{userId}")
  @ResponseBody
  public ResponseEntity<Page<WaitingResponse>> getUserWaitingList(
      @PathVariable Long userId,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
    Page<WaitingResponse> waitingList = waitingService.getUserWaitingList(userId, pageable);

    return ResponseEntity.ok(waitingList);
  }
}
