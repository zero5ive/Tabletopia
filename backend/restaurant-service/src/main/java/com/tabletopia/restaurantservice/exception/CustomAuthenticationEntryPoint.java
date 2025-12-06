package com.tabletopia.restaurantservice.exception;

import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.HttpSession;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class CustomAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;
    private static final String ADMIN_CONTEXT_ATTR = HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY;

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {
        HttpSession session = request.getSession(false);

        // 관리자 세션이 존재하는지 확인
        if (session != null && session.getAttribute(ADMIN_CONTEXT_ATTR) != null) {
            // 관리자가 로그인했지만 사용자 전용 엔드포인트에 접근하려는 경우
            response.setStatus(HttpServletResponse.SC_FORBIDDEN);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(
                    Map.of("success", false, "message", "관리자 계정으로는 사용자 API에 접근할 수 없습니다. 사용자 계정으로 로그인해주세요.")
            ));
        } else {
            // 유효한 JWT도 없고 관리자 세션도 없는, 진짜 미인증 요청인 경우
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.setContentType("application/json");
            response.setCharacterEncoding("UTF-8");
            response.getWriter().write(objectMapper.writeValueAsString(
                    Map.of("success", false, "message", "인증이 필요합니다. 로그인 후 이용해주세요.")
            ));
        }
    }
}
