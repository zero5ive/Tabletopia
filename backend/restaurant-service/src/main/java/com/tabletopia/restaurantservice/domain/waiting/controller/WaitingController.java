package com.tabletopia.restaurantservice.domain.waiting.controller;

import com.tabletopia.restaurantservice.domain.admin.dto.AdminDTO;
import com.tabletopia.restaurantservice.domain.admin.service.AdminService;
import com.tabletopia.restaurantservice.domain.user.controller.UserController;
import com.tabletopia.restaurantservice.domain.user.dto.UserDTO;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingEvent;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingRequest;
import com.tabletopia.restaurantservice.domain.waiting.dto.WaitingResponse;
import com.tabletopia.restaurantservice.domain.waiting.entity.Waiting;
import com.tabletopia.restaurantservice.domain.waiting.enums.WaitingState;
import com.tabletopia.restaurantservice.domain.waiting.service.WaitingNotificationService;
import com.tabletopia.restaurantservice.domain.waiting.service.WaitingService;
import java.security.Principal;
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
  private final UserService userService;
  private final AdminService adminService;

  /**
   * 웨이팅 오픈 상태 조회 REST API (사용자용)
   *
   * @author 성유진
   */
  @GetMapping("/api/user/waiting/status")
  @ResponseBody
  public Map<String, Object> getWaitingStatus(@RequestParam Long restaurantId) {
    boolean isOpen = waitingService.isWaitingOpen(restaurantId);

    // 대기 중인 팀 수 조회
    Pageable pageable = PageRequest.of(0, 1000);
    Page<WaitingResponse> waitingList = waitingService.getWaitingList(restaurantId, WaitingState.WAITING, pageable);

    long team2 = waitingList.getContent().stream()
        .filter(w -> w.getPeopleCount() >= 1 && w.getPeopleCount() <= 2)
        .count();
    long team4 = waitingList.getContent().stream()
        .filter(w -> w.getPeopleCount() >= 3)
        .count();

    log.debug("웨이팅 상태 조회 - restaurantId: {}, isOpen: {}, team2: {}, team4: {}",
        restaurantId, isOpen, team2, team4);

    return Map.of(
        "isOpen", isOpen,
        "team2", team2,
        "team4", team4
    );
  }

  @GetMapping("/api/user/waitings/status")
  @ResponseBody
  public Map<String, Boolean> getUserWaitingStatus(@RequestParam Long restaurantId) {
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
    log.debug("sessionId: {}", sessionId);

    // 1. 인증 정보 확인
    if (accessor.getUser() == null) {
      log.warn("인증되지 않은 요청. 세션 ID: {}", sessionId);
      sendErrorEvent("인증이 필요합니다.");
      return;
    }


    // 2. 인증된 사용자 정보 조회
    String userEmail = accessor.getUser().getName();
    User user = userService.findByEmail(userEmail);

    log.debug("웨이팅 등록 요청 - 유저: {}, 전화번호: {}",
        user.getName(), user.getPhoneNumber());


    // 3. 웨이팅 오픈 확인
    if (!waitingService.isWaitingOpen(waitingRequest.getRestaurantId())) {
      log.warn("웨이팅이 닫혀있음");
      sendErrorEvent("현재 웨이팅 등록이 불가능합니다.");
      return;
    }

    try {
      //  Service 호출 (엔티티 반환받음)
      Waiting waiting = waitingService.registerWaiting(
          waitingRequest.getRestaurantId(),
          user.getId(),
          waitingRequest.getPeopleCount()
      );

      //  Controller에서 엔티티를 사용해서 응답 생성
      WaitingEvent waitingEvent = new WaitingEvent();
      waitingEvent.setType("REGIST");
      waitingEvent.setRestaurantId(waitingRequest.getRestaurantId());
      waitingEvent.setSender(user.getId());
      waitingEvent.setSenderName(user.getName());
      waitingEvent.setTel(user.getPhoneNumber());
      waitingEvent.setContent(
          waiting.getRestaurantNameSnapshot() +  "에 " + waiting.getPeopleCount()+ "명 등록");

      log.info("✅ /topic/regist 로 메시지 전송 - restaurantId: {}, waitingId: {}",
          waitingRequest.getRestaurantId(), waiting.getId());
      simpMessagingTemplate.convertAndSend("/topic/regist", waitingEvent);

      log.debug("웨이팅 등록 완료 (세션: {}, userId: {})",
          sessionId, user.getId());

    } catch (com.tabletopia.restaurantservice.domain.waiting.exception.WaitingRegistException e) {
      log.warn("중복 웨이팅 등록 시도 - userId: {}, message: {}", user.getId(), e.getMessage());
      sendErrorEvent("이미 등록하셨습니다.");
    } catch (Exception e) {
      log.error("웨이팅 등록 실패 - userId: {}, error: {}", user.getId(), e.getMessage());
      sendErrorEvent("웨이팅 등록에 실패했습니다.");
    }


  }

  /**
   * 웨이팅 리스트 조회 (관리자용)
   *
   * @author 성유진
   */
  @GetMapping("/api/admin/restaurants/{restaurantId}/waiting")
  @ResponseBody
  public ResponseEntity<Page<WaitingResponse>> getAdminList(@PathVariable Long restaurantId,
      @RequestParam String status,
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size) {

    Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());

    // String을 Enum으로 변환
    WaitingState waitingState = WaitingState.valueOf(status);

    Page<WaitingResponse> waitingList = waitingService.getWaitingList(restaurantId, waitingState, pageable);

    return  ResponseEntity.ok(waitingList);
  }

  @GetMapping("/api/user/waitings/{restaurantId}")
  @ResponseBody
  public ResponseEntity<Page<WaitingResponse>> getUserList(@PathVariable Long restaurantId,
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
   * 웨이팅 취소 (사용자용)
   *
   * @author 성유진
   */
  @PutMapping("/api/user/waitings/{id}/cancel")
  @ResponseBody
  public ResponseEntity<String>cancelUserWaiting(@PathVariable Long id, @RequestParam Long restaurantId) {

    Waiting waiting = waitingService.cancelWaiting(id, restaurantId);

    // 개인화된 알림 전송
    waitingNotificationService.notifyWaitingStatusChange(waiting, restaurantId, "cancel");

    return ResponseEntity.ok("웨이팅이 취소되었습니다.");


  }

  /**
   * 웨이팅 취소 (관리자용)
   *
   * @author 성유진
   */
  @PutMapping("/api/admin/waiting/{id}/cancel")
  @ResponseBody
  public ResponseEntity<WaitingResponse>cancelWaitingAdmin(@PathVariable Long id, @RequestParam Long restaurantId) {

    Waiting waiting = waitingService.cancelAdminWaiting(id, restaurantId);
    AdminDTO admin = adminService.getAdminByEmail();
    log.debug("웨이팅 취소한 관리자 아이디 : " + admin.getEmail());

    WaitingResponse response = WaitingResponse.from(waiting, restaurantId);


    // 개인화된 알림 전송
    waitingNotificationService.notifyWaitingStatusChange(waiting, restaurantId, "cancel");

    log.info("웨이팅 취소 완료 - waitingNumber: {}, userId: {}",
        waiting.getWaitingNumber(), waiting.getUser().getId());

    // Response DTO 반환
    return ResponseEntity.ok(response);
  }

  /**
   * 웨이팅 호출 (관리자용)
   *
   * @author 서예닮
   * @since 2025-10-13
   */
  @PutMapping("/api/admin/waiting/{id}/called")
  @ResponseBody
  public ResponseEntity<String>callWaiting(@PathVariable Long id, @RequestParam Long restaurantId) {
    Waiting  waiting  =waitingService.callWaiting(id, restaurantId);

    waitingNotificationService.notifyWaitingStatusChange(waiting,restaurantId,"call");

    return ResponseEntity.ok("웨이팅이 호출되었습니다.");
  }

  /**
   * 웨이팅 착석 (관리자용)
   *
   * @author 서예닮
   * @since 2025-10-13
   */
  @PutMapping("/api/admin/waiting/{id}/seated")
  @ResponseBody
  public  ResponseEntity<String> seatedWaiting(@PathVariable Long id, @RequestParam Long restaurantId){
    Waiting  waiting  =waitingService.seatedWaiting(id, restaurantId);

    waitingNotificationService.notifyWaitingStatusChange(waiting,restaurantId,"seated");

    return ResponseEntity.ok("착석되었습니다.");
  }

  /**
   * 내 앞에 대기 중인 팀 수 조회 (사용자용)
   *
   * @author 서예닮
   * @since 2025-10-14
   */
  @GetMapping("/api/user/waiting/teams-ahead")
  @ResponseBody
  public ResponseEntity<Map<String, Integer>> getTeamsAhead(
      @RequestParam Long restaurantId,
      @RequestParam Integer waitingNumber) {
    Integer teamsAhead = waitingService.getTeamsAheadCount(restaurantId, waitingNumber);
    return ResponseEntity.ok(Map.of("teamsAhead", teamsAhead));
  }

  /**
   * 사용자의 웨이팅 내역 조회 (사용자용)
   *
   * @author 서예닮
   * @since 2025-10-15
   */
  @GetMapping("/api/user/waiting/history")
  @ResponseBody
  public ResponseEntity<Page<WaitingResponse>> getUserWaitingList(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size,
      Principal principal) {

    try {
      // Principal null 체크
      if (principal == null) {
        log.error("웨이팅 내역 조회 실패: 인증되지 않은 사용자");
        return ResponseEntity.status(401).build();
      }

      // JWT 토큰에서 현재 사용자 정보 추출
      String currentUserEmail = principal.getName();
      if (currentUserEmail == null) {
        log.error("웨이팅 내역 조회 실패: 사용자 이메일이 null");
        return ResponseEntity.status(401).build();
      }

      User user = userService.findByEmail(currentUserEmail);
      if (user == null) {
        log.error("웨이팅 내역 조회 실패: 사용자를 찾을 수 없음 - email: {}", currentUserEmail);
        return ResponseEntity.status(404).build();
      }

      Long userId = user.getId();

      log.info("웨이팅 내역 조회 - userId: {}, email: {}, page: {}, size: {}",
          userId, currentUserEmail, page, size);

      Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
      Page<WaitingResponse> waitingList = waitingService.getUserWaitingList(userId, pageable);

      return ResponseEntity.ok(waitingList);
    } catch (Exception e) {
      log.error("웨이팅 내역 조회 실패: {}", e.getMessage(), e);
      return ResponseEntity.status(500).build();
    }
  }

  //에러 메서드
  private void sendErrorEvent(String message) {
    WaitingEvent errorEvent = new WaitingEvent();
    errorEvent.setType("ERROR");
    errorEvent.setContent(message);
    simpMessagingTemplate.convertAndSend("/topic/regist", errorEvent);
    }
}
