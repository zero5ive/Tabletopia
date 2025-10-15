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

  //어드민 : 웨이팅 오픈
  @MessageMapping("/waiting/open")
  public void open(){

    log.debug("웨이팅 서버 접속");

    // 웨이팅 오픈 상태 저장
    waitingService.setWaitingOpen(true);

    WaitingEvent waitingEvent = new WaitingEvent();
    waitingEvent.setType("OPEN");
    waitingEvent.setContent("웨이팅 등록 가능");

    simpMessagingTemplate.convertAndSend("/topic/open", waitingEvent);

  }

  //어드민 : 웨이팅 닫힘
  @MessageMapping("/waiting/close")
  public void close(){

    log.debug("웨이팅 닫기 요청 받음");

    // 웨이팅 닫기 상태 저장
    waitingService.setWaitingOpen(false);

    WaitingEvent  waitingEvent = new WaitingEvent();
    waitingEvent.setType("CLOSE");
    waitingEvent.setContent("웨이팅 등록 중단");

    simpMessagingTemplate.convertAndSend("/topic/close", waitingEvent);
  }

  //시용자 : 웨이팅 등록
@MessageMapping("/waiting/regist")
  public void regist(@Payload WaitingRequest waitingRequest, SimpMessageHeaderAccessor headerAccessor){

    log.debug("웨이팅 등록 요청 받음");
    //웹소켓 sessionId
  String sessionId = (String) headerAccessor.getHeader("simpSessionId");

  try {

    // 자동으로 다음 웨이팅 번호 생성
    Integer maxWaitingNumber = waitingService.getMaxWaitingNumber(waitingRequest.getRestaurantId());
    int nextWaitingNumber = (maxWaitingNumber != null) ? maxWaitingNumber + 1 : 1;

      Waiting waiting = new Waiting(waitingRequest.getRestaurantId(), waitingRequest.getUserId(),
          waitingRequest.getPeopleCount(),
          waitingRequest.getRestaurantName());

      waiting.assignWaitingNumber(nextWaitingNumber);

      waitingService.save(waiting);

      WaitingEvent waitingEvent = new WaitingEvent();
      waitingEvent.setType("REGIST");
      waitingEvent.setContent("웨이팅 등록");
      waitingEvent.setSender(waitingRequest.getUserId());
      waitingEvent.setContent(
          waitingRequest.getRestaurantName() +  "에 " + waitingRequest.getPeopleCount() + "명 등록");

      simpMessagingTemplate.convertAndSend("/topic/regist", waitingEvent);

      log.debug(" 웨이팅 등록 완료 및 메시지 전송 (세션: {}, userId: {})",
          sessionId, waitingRequest.getUserId());

    }catch (Exception e){
      log.error("웨이팅 등록 실패 : {}" , e.getMessage());

      WaitingEvent waitingEvent = new WaitingEvent();
      waitingEvent.setType("ERROR");
      waitingEvent.setContent("웨이팅 등록 실패");

      simpMessagingTemplate.convertAndSend("/topic/regist", waitingEvent);
    }
}

  // 웨이팅 오픈 상태 조회 REST API
  @GetMapping("/api/waiting/status")
  @ResponseBody
  public Map<String, Boolean> getWaitingStatus() {
    boolean isOpen = waitingService.isWaitingOpen();
    log.debug("웨이팅 상태 조회 요청 - isOpen: {}", isOpen);
    return Map.of("isOpen", isOpen);
  }


  //웨이팅 리스트 조회
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


  //웨이팅 취소
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
