package com.tabletopia.realtimeservice.domain.waiting.controller;

import com.tabletopia.realtimeservice.domain.waiting.dto.WaitingEvent;
import com.tabletopia.realtimeservice.domain.waiting.dto.WaitingRequest;
import com.tabletopia.realtimeservice.domain.waiting.entity.Waiting;
import com.tabletopia.realtimeservice.domain.waiting.repository.WaitingRepository;
import com.tabletopia.realtimeservice.domain.waiting.service.WaitingService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

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
  private final SimpMessagingTemplate simpMessagingTemplate;

  //어드민 : 웨이팅 오픈
  @MessageMapping("/waiting/open")
  public void open(){

    log.debug("웨이팅 서버 접속");

    WaitingEvent  waitingEvent = new WaitingEvent();
    waitingEvent.setType("OPEN");
    waitingEvent.setContent("웨이팅 등록 가능");

    simpMessagingTemplate.convertAndSend("/topic/open", waitingEvent);

  }

  //어드민 : 웨이팅 닫힘
  @MessageMapping("/waiting/close")
  public void close(){

    log.debug("웨이팅 딛기 요청 받음");

    WaitingEvent  waitingEvent = new WaitingEvent();
    waitingEvent.setType("CLOSE");
    waitingEvent.setContent("웨이팅 등록 중단");

    simpMessagingTemplate.convertAndSend("/topic/close", waitingEvent);
  }

  //시용자 : 웨이팅 등록
@MessageMapping("/waiting/regist")
  public void regist(@Payload  WaitingRequest waitingRequest, SimpMessageHeaderAccessor headerAccessor){

    log.debug("웨이팅 등록 요청 받음");
    //웹소켓 sessionId
    String sessionId = headerAccessor.getSessionId();

    try {
      Waiting waiting = new Waiting(waitingRequest.getRestaurantId(), waitingRequest.getUserId(),
          waitingRequest.getPeopleCount(),
          waitingRequest.getRestaurantName(),
          waitingRequest.getWaitingNumber());

      waitingService.save(waiting);

      WaitingEvent waitingEvent = new WaitingEvent();
      waitingEvent.setType("REGIST");
      waitingEvent.setContent("웨이팅 등록");
      waitingEvent.setSender(waitingRequest.getUserId());
      waitingEvent.setContent(
          waitingRequest.getRestaurantName() + " 에" + waitingRequest.getPeopleCount() + " 명 등록");

      simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue/regist", waitingEvent);

      log.debug(" 웨이팅 등록 완료 및 메시지 전송 (세션: {}, userId: {})",
          sessionId, waitingRequest.getUserId());

    }catch (Exception e){
      log.error("웨이팅 등록 실패 : {}" , e.getMessage());

      WaitingEvent waitingEvent = new WaitingEvent();
      waitingEvent.setType("ERROR");
      waitingEvent.setContent("웨이팅 등록 실패");

      simpMessagingTemplate.convertAndSendToUser(sessionId, "/queue/regist", waitingEvent);
    }
}

}
