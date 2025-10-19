package com.tabletopia.restaurantservice.domain.chat.controller;

import com.tabletopia.restaurantservice.domain.chat.service.ChatService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor

// Chat 주석달기
public class ChatController {

  private final ChatService chatService;

  @PostMapping
  public ResponseEntity<Map<String, String>> chat(
      @RequestBody Map<String, String> req,
      Authentication authentication
  ) {
    if (authentication == null) {
      return ResponseEntity.status(401)
          .body(Map.of("reply", "로그인 후 이용 가능합니다 🔒"));
    }

    String message = req.get("message");
    String userEmail = authentication.getName(); // JWT subject = email
    boolean isAdmin = authentication.getAuthorities().stream()
        .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));

    String reply = chatService.getReply(message, userEmail, isAdmin);
    return ResponseEntity.ok(Map.of("reply", reply));
  }
}
