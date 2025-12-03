package com.tabletopia.restaurantservice.filter;

import com.tabletopia.restaurantservice.domain.user.service.CustomUserDetailsService;
import com.tabletopia.restaurantservice.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureException;
import io.jsonwebtoken.UnsupportedJwtException;
import lombok.extern.slf4j.Slf4j;

import java.io.IOException;

/**                                                                                                                                                   │
* 모든 들어오는 요청을 가로채 JWT(JSON Web Token)를 검증하는 Spring Security 필터입니다.                                                             │
* Authorization 헤더에서 JWT를 추출하고 유효성을 검사하여 사용자를 인증합니다.                                                                       │
*                                                                                                                                                    │
* @author 이세형                                                                                                                                     │
* @since 2025-10-01                                                                                                                                  │
*/
@Component
@RequiredArgsConstructor
@Slf4j
public class JwtRequestFilter extends OncePerRequestFilter {

    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    /**
     * HTTP 요청을 가로채 JWT를 검증하고 SecurityContextHolder를 업데이트하는 필터 메서드입니다.
     *
     * @param request  클라이언트가 보낸 요청 객체
     * @param response 클라이언트에게 보내는 응답 객체
     * @param chain    필터 체인
     * @throws ServletException 서블릿 처리 중 예외 발생 시
     * @throws IOException      I/O 처리 중 예외 발생 시
     * @author 이세형
     * @since 2025-12-03
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain) throws ServletException, IOException {
        // 요청 기본 정보 확인을 위한로깅
        log.warn("Request Method: {}", request.getMethod());

        final String authorizationHeader = request.getHeader("Authorization");
        String username = null;
        String jwt = null;

        // Header 먼저 체크하고 없으면 바로 리턴
        // JWT 없으면 예외 터뜨리지 않고 그냥 인증 실패 처리
        if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
            log.debug("No valid Authorization header - continuing without authentication");
            chain.doFilter(request, response);
            return;
        }

        // Authorization 헤더에서 JWT 추출
        jwt = authorizationHeader.substring(7);

        // 빈 jwt 체크(admin session에서 넘어오는 것을 차단)
        // adminSessionException 만들어도 좋을것 같다
        if (jwt.isEmpty()) {
            log.warn("JWT token is empty after 'Bearer ' prefix");
            chain.doFilter(request, response);
            return;
        }
        log.debug("Extracted JWT: {}", jwt);

        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                // JWT에서 username 추출
                username = jwtUtil.extractUsername(jwt);
                log.debug("Extracted username from JWT: {}", username);
            } catch (IllegalArgumentException e) {
                log.error("JWT claims string is empty.", e);
            } catch (ExpiredJwtException e) {
                log.warn("JWT token is expired.", e);
            } catch (SignatureException | MalformedJwtException | UnsupportedJwtException e) {
                log.error("Invalid JWT token.", e);
            }
        } else {
            log.debug("Authorization header is missing or does not start with Bearer.");
        }
        // SecurityContextHolder에 인증 정보가 없는 경우에만 인증 수행
        if (username != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            log.debug("Attempting to authenticate user: {}", username);

            // DB에서 UserDetails 조회
            UserDetails userDetails = this.userDetailsService.loadUserByUsername(username);
            log.debug("Loaded UserDetails for {}: {}", username, userDetails != null ? userDetails.getUsername() : "null");

            // JWT 검증
            if (jwtUtil.validateToken(jwt, userDetails)) {
                log.debug("JWT token is valid for user: {}", username);

                // 인증 객체 생성 후 SecurityContextHolder에 설정
                UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                usernamePasswordAuthenticationToken
                        .setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                log.debug("SecurityContextHolder populated with user: {}", username);
            } else {
                log.warn("JWT token validation failed for user: {}", username);
            }
        } else if (username == null) {
            log.debug("Username is null, skipping authentication.");
        } else {
            log.debug("SecurityContextHolder already contains authentication for user: {}", SecurityContextHolder.getContext().getAuthentication().getName());
        }
        // 다음 필터 체인 실행
        chain.doFilter(request, response);
    }
}
