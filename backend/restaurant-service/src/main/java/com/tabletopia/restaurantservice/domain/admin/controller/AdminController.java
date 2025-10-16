package com.tabletopia.restaurantservice.domain.admin.controller;

import com.tabletopia.restaurantservice.domain.admin.dto.AdminLoginDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminRegisterDTO;
import com.tabletopia.restaurantservice.domain.admin.service.AdminService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/admin/api")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AuthenticationManager authenticationManager;

    @GetMapping("/me")
    public ResponseEntity<?> getAdminInfo() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            return ResponseEntity.ok(Map.of("username", authentication.getName()));
        }
        return ResponseEntity.status(401).body(Map.of("message", "Not authenticated"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginDTO adminLoginDTO) {
        log.debug("admin 로그인 시도 요청이 있었습니다................");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(adminLoginDTO.getEmail(), adminLoginDTO.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);
            log.debug("Admin login successful for user: {}", adminLoginDTO.getEmail());
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin login successful"));
        } catch (BadCredentialsException e) {
            log.warn("Admin login failed for user: {}. Error: {}", adminLoginDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "이메일 또는 비밀번호가 올바르지 않습니다."));
        } catch (DisabledException e) {
            log.warn("Admin login failed for user: {}. Error: {}", adminLoginDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "계정이 비활성화되었습니다."));
        } catch (LockedException e) {
            log.warn("Admin login failed for user: {}. Error: {}", adminLoginDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "계정이 잠금 처리되었습니다."));
        } catch (AuthenticationException e) { // Catch all other authentication exceptions
            log.warn("Admin login failed for user: {}. Error: {}", adminLoginDTO.getEmail(), e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "인증에 실패하였습니다."));
        } catch (Exception e) {
            log.warn("에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "오류입니다.실패하였습니다."));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<Map<String, Object>> register(@RequestBody AdminRegisterDTO adminRegisterDTO) {
        log.debug("==============admin회원가입 요청 {}", adminRegisterDTO);
        adminService.register(adminRegisterDTO);
        return ResponseEntity.ok(Map.of("success", true, "message", "회원가입 성공"));
    }

    @GetMapping("/dashboard")
    public ResponseEntity<?> getDashboardData() {
        return ResponseEntity.ok(Map.of("data", "Some secret dashboard data for admins"));
    }
}
