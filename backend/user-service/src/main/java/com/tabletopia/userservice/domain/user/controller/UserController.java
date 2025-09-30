package com.tabletopia.userservice.domain.user.controller;

import com.tabletopia.userservice.domain.user.dto.AuthenticationRequest;
import com.tabletopia.userservice.domain.user.dto.UserDTO;
import com.tabletopia.userservice.domain.user.service.CustomUserDetailsService;
import com.tabletopia.userservice.domain.user.service.UserService;
import com.tabletopia.userservice.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final CustomUserDetailsService userDetailsService;
    private final JwtUtil jwtUtil;

    /**
     * 회원가입 처리
     */
    @PostMapping("/api/user/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody UserDTO userDto) {
        userService.register(userDto);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "회원가입 성공"
        ));
    }

    @GetMapping("/login")
    public String loginCheck(){
        log.debug("=========================loginCheck");
        return "로그인요청드루옴";
    }

    /**
     * 로그인 처리
     */
    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody AuthenticationRequest request) {
        try {
            log.debug("로그인 요청: {}", request.getEmail());

            // 인증 시도
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            request.getEmail(),
                            request.getPassword()
                    )
            );

            // 인증 성공 시 UserDetails + JWT 생성
            UserDetails userDetails = userDetailsService.loadUserByUsername(request.getEmail());
            String jwt = jwtUtil.generateToken(userDetails);

            // React에서 기대하는 응답 구조
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공",
                    "token", jwt
            ));

        } catch (Exception e) {
            log.warn("로그인 실패: {}", e.getMessage());

            // 인증 실패 시 React용 응답
            return ResponseEntity.ok(Map.of(
                    "success", false,
                    "message", "이메일 또는 비밀번호가 잘못되었습니다."
            ));
        }
    }
}
