package com.tabletopia.restaurantservice.config;

import com.tabletopia.restaurantservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

/**
 * 스톰프 웹소켓 설정 클래스
 *
 * @author 김예진
 * @since 2025-09-25
 */
@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

  private final JwtUtil jwtUtil;
  private final UserDetailsService userDetailsService;

  /**
   * 경로 설정
   *
   * @author 김예진
   * @since 2025-09-25
   */
  @Override
  public void configureMessageBroker(MessageBrokerRegistry registry) {
    // 브로커 경로 설정
    // 서버가 클라이언트에게 메시지를 브로드캐스팅
    registry.enableSimpleBroker("/topic", "/queue");

    // 앱 경로 설정. 클라이언트에서 서버로 요청
    registry.setApplicationDestinationPrefixes("/app");

    // 개인 메시지 경로 설정
    registry.setUserDestinationPrefix("/user");
  }

  /**
   * STOMP 엔드포인트 설정
   * <p>
   * 예: 클라이언트는 ws://localhost:포트번호/ws 로 접속
   *
   * @author 김예진
   * @since 2025-09-25
   */
  @Override
  public void registerStompEndpoints(StompEndpointRegistry registry) {
    registry
        .addEndpoint("/ws")
        .setAllowedOriginPatterns("*")
        .withSockJS();
  }

  /**
   * WebSocket 클라이언트로 들어오는 모든 메시지에 대해 인증 정보를 SecurityContext에 설정
   * 이를 통해 메시지 처리(@MessageMapping) 시 현재 로그인한 사용자를 식별 가능
   *
   * @param registration WebSocket 클라이언트 인바운드 채널 설정 객체
   * @author 김예진
   */
  @Override
  public void configureClientInboundChannel(ChannelRegistration registration) {
    // STOMP 메시지가 서버로 들어올 때 실행되는 인터셉터 등록
    registration.interceptors(new ChannelInterceptor() {

      /**
       * 클라이언트로부터 메시지가 전송되기 전에 실행되는 메서드
       * JWT 토큰을 검증하고 인증 정보를 WebSocket 세션에 등록
       * @author 김예진
       * @since 2025-10-16
       *
       * @param message 클라이언트가 보낸 STOMP 메시지
       * @param channel 메시지가 전송될 채널
       * @return 처리된 메시지 (null 반환 시 메시지 전송 중단)
       */
      @Override
      public Message<?> preSend(Message<?> message, MessageChannel channel) {
        // STOMP 메시지의 헤더 정보에 접근하기 위한 accessor 생성
        StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);

        // STOMP CONNECT 명령인 경우 (클라이언트가 WebSocket 연결을 시도할 때)
        if (StompCommand.CONNECT.equals(accessor.getCommand())) {
          // HTTP 헤더에서 Authorization 헤더 값 추출
          String token = accessor.getFirstNativeHeader("Authorization");

          // Bearer 토큰 형식인지 확인
          if (token != null && token.startsWith("Bearer ")) {
            // "Bearer " 접두사 제거하고 실제 토큰만 추출 (7글자 = "Bearer ".length())
            token = token.substring(7);

            try {
              // JWT 토큰에서 사용자 이름(이메일) 추출
              String username = jwtUtil.extractUsername(token);

              // 사용자 이름으로 UserDetails 객체 로드 (DB에서 사용자 정보 조회)
              UserDetails userDetails = userDetailsService.loadUserByUsername(username);

              // Spring Security의 Authentication 객체 생성
              // 사용자 정보, 비밀번호(빈 문자열), 권한 정보를 담음
              Authentication auth = new UsernamePasswordAuthenticationToken(
                  userDetails, // principal: 인증된 사용자 정보
                  "", // credentials: 비밀번호 (JWT 인증이므로 빈 값)
                  userDetails.getAuthorities()  // authorities: 사용자 권한 목록
              );

              // WebSocket 세션에 인증 정보 등록
              // 이후 @MessageMapping에서 accessor.getUser()로 접근 가능
              accessor.setUser(auth);

              // Spring Security의 전역 SecurityContext에도 인증 정보 저장
              // 이렇게 하면 @PreAuthorize 등의 보안 어노테이션 사용 가능
              org.springframework.security.core.context.SecurityContextHolder
                  .getContext()
                  .setAuthentication(auth);

            } catch (Exception e) {
              // JWT 파싱 실패, 만료된 토큰, 유효하지 않은 사용자 등의 예외 처리
              log.warn("JWT 인증 실패: {}", e.getMessage());
              // 인증 실패 시에도 메시지는 계속 전달됨 (필요시 null 반환으로 차단 가능)
            }
          }

          // STOMP MESSAGE 명령인 경우 (클라이언트가 메시지를 전송할 때)
        } else if (StompCommand.MESSAGE.equals(accessor.getCommand())) {
          // CONNECT 시 저장된 인증 정보를 다시 가져옴
          Authentication auth = (Authentication) accessor.getUser();

          // 인증 정보가 있으면 SecurityContext에 다시 설정
          // (각 메시지마다 인증 정보를 유지하기 위함)
          if (auth != null) {
            org.springframework.security.core.context.SecurityContextHolder
                .getContext()
                .setAuthentication(auth);
          }
        }

        // 메시지를 다음 단계로 전달 (null 반환 시 메시지 전송 차단)
        return message;
      }
    });
  }
}
