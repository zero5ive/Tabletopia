package com.tabletopia.userservice.handler;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.authentication.AuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * loginSuccess타이밍에 로직을 담을 수 있게 해주는 handler
 *
 * @author 이세형
 * @since 2025-09-25
 * */
@Slf4j
@Component
public class OAuth2SuccessHandler implements AuthenticationSuccessHandler {

//    @Value("${app.oauth.success-redirect}")
//    private String redirectUrl;

    /**
     * 소셜로그인이 완료되고 난 후 보낼 요청주소를 담은 메서드
     * 핸들러 특성상 부모 객체가 생성될 떄 자동 실행됩니다.
     *
     * @author 이세형
     * @since 2025-09-25
     * */
    @Override
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        log.debug("====얘가 나와야 함 ===핸들러로 OAuth인증 마무리 -> 여기서 토큰생성등 로직으로 보내야 하나?");
        //소셜로그인이 완료되면 보낼 redirect 주소 일단 success
        response.sendRedirect("http://localhost:10022/api/user/login/ok");
    }
}
