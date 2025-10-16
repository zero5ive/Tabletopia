package com.tabletopia.restaurantservice.domain.user.controller;

import com.tabletopia.restaurantservice.domain.refreshtoken.service.RefreshTokenService;
import com.tabletopia.restaurantservice.domain.user.dto.AuthenticationRequest;
import com.tabletopia.restaurantservice.domain.user.dto.AuthenticationResponse;
import com.tabletopia.restaurantservice.domain.user.dto.UserDTO;
import com.tabletopia.restaurantservice.domain.user.dto.UserInfoDTO;
import com.tabletopia.restaurantservice.domain.user.service.CustomUserDetailsService;
import com.tabletopia.restaurantservice.domain.user.service.UserService;
import com.tabletopia.restaurantservice.util.JwtUtil;
import com.tabletopia.restaurantservice.util.SecurityUtil;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseCookie;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import com.tabletopia.restaurantservice.domain.user.dto.UserInfoDTO;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.Map;

/**
 * 사용자 관련 HTTP 요청을 처리하는 REST 컨트롤러입니다.
 * 회원가입, 로그인, 토큰 재발급 등의 API 엔드포인트를 제공합니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;
    private final RefreshTokenService refreshTokenService;

    /**
     * 회원가입 처리
     */
    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDto) {
        log.debug("=====회원가입 요청 {}", userDto);
        userService.register(userDto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회원가입 성공"
        ));
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthenticationRequest request) {
        try {
            log.debug("로그인 요청: {},{}", request.getEmail(), request.getPassword());

            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            final UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            final String accessToken = jwtUtil.generateToken(userDetails);
            final String refreshToken = refreshTokenService.createRefreshToken(userDetails.getUsername());

            ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
                    .maxAge(7 * 24 * 60 * 60) // 7일
                    .path("/")
                    .secure(false)
                    .httpOnly(true)
                    .build();
            log.debug("들-=====어갈 쿠키는"+ cookie.toString());

            return ResponseEntity.ok()
                    .header(HttpHeaders.SET_COOKIE, cookie.toString())
                    .body(new AuthenticationResponse(true, accessToken));

        } catch (Exception e) {
            log.warn("로그인 실패: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "이메일 또는 비밀번호가 잘못되었습니다."));
        }
    }

    /**
     * Access Token 재발급
     *
     */
    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue("refreshToken") String refreshToken) {
        return refreshTokenService.validateRefreshToken(refreshToken)
                .map(token -> {
                    UserDetails userDetails = userDetailsService.loadUserByUsername(token.getUsername());
                    String newAccessToken = jwtUtil.generateToken(userDetails);
                    return ResponseEntity.ok(new AuthenticationResponse(true, newAccessToken));
                })
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid Refresh Token"));
    }

    /**
     * 로그아웃 처리
     */
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@CookieValue(value = "refreshToken", required = false) String refreshToken) {
        if (refreshToken != null) {
            refreshTokenService.deleteRefreshToken(refreshToken);
        }

        ResponseCookie expiredCookie = ResponseCookie.from("refreshToken", "")
                .maxAge(0)
                .path("/")
                .build();
        return ResponseEntity.ok()
                .header(HttpHeaders.SET_COOKIE, expiredCookie.toString())
                .body(Map.of("success", true, "message", "로그아웃 성공"));
    }

    /**
     * 현재 로그인된 사용자 정보 조회
     */
    @GetMapping("/me")
    public ResponseEntity<UserInfoDTO> getCurrentUser() {
        String name = userService.getCurrentUserInfo().getName();
        log.debug("가져온 이름은"+ name+"입니다.");
        return ResponseEntity.ok(userService.getCurrentUserInfo());
    }

  /**
   * @author 서예닮
   * @since 2025-10-16
   *  로그인된 사용자 정보 변경
   */
  @PutMapping("/update")
  public ResponseEntity<String> updateUser(@RequestBody @Valid UserUpdateDTO userUpdateDTO) {
    userService.updateUser(userUpdateDTO);
    return ResponseEntity.ok("프로필이 저장되었습니다");
  }
}