package com.tabletopia.restaurantservice.domain.chat.controller;

import com.tabletopia.restaurantservice.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

/**
 * 채팅 관련 API 컨트롤러
 *
 * 사용자 메시지를 받아 ChatService로 전달하고,
 * AI 또는 로컬 추천 로직의 응답을 반환한다.
 *
 * 인증 정보(Authentication)를 기반으로
 * 로그인 여부 및 관리자 권한을 판별한다.
 *
 * @author 김지민
 * @since 2025-10-19
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor

// Chat 주석달기
public class ChatController {

  private final ChatService chatService;

  /**
   * 채팅 요청 처리
   *
   * 1. 클라이언트로부터 message(JSON) 요청을 받는다.
   * 2. 인증되지 않은 사용자는 401 응답을 반환한다.
   * 3. 로그인된 사용자의 이메일과 권한 정보를 추출한다.
   * 4. ChatService를 통해 적절한 응답 메시지를 생성하고 반환한다.
   *
   * @param req message 필드를 포함한 요청 본문 (예: {"message": "강남 맛집 추천"})
   * @param authentication 인증 객체 (JWT 기반 사용자 정보)
   * @return reply 필드를 포함한 응답 JSON (예: {"reply": "추천 결과"})
   */
  @PostMapping
  public ResponseEntity<Map<String, String>> chat(
      @RequestBody Map<String, String> req,
      Authentication authentication
  ) {
    // 인증되지 않은 사용자 접근 차단
    if (authentication == null) {
      return ResponseEntity.status(401)
          .body(Map.of("reply", "로그인 후 이용 가능합니다 🔒"));
    }

    // 요청 메시지와 사용자 정보 추출
    String message = req.get("message");
    String userEmail = authentication.getName(); // JWT subject(email)
    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    // ChatService를 통한 응답 생성
    String reply = chatService.getReply(message, userEmail, isAdmin);

    // JSON 형태로 반환
    return ResponseEntity.ok(Map.of("reply", reply));
  }
}
