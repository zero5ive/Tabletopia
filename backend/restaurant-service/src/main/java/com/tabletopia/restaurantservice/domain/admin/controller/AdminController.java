package com.tabletopia.restaurantservice.domain.admin.controller;

import com.tabletopia.restaurantservice.domain.admin.dto.AdminDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminLoginDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminRegisterDTO;
import com.tabletopia.restaurantservice.domain.admin.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpSession;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository;


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
        AdminDTO adminDTO = adminService.getAdminByEmail();
        return ResponseEntity.ok(Map.of("admin", adminDTO));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AdminLoginDTO adminLoginDTO) {
        log.debug("admin 로그인 시도 요청이 있었습니다................");
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(adminLoginDTO.getEmail(), adminLoginDTO.getPassword())
            );
            SecurityContextHolder.getContext().setAuthentication(authentication);

            // 세션에 SecurityContext 저장
            HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.currentRequestAttributes()).getRequest();
            HttpSession session = request.getSession(true);
            session.setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());

            log.debug("Admin login successful for user: {}", adminLoginDTO.getEmail());
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin login successful"));
        } catch (Exception e) {
            log.warn("에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "오류입니다.실패하였습니다."));
        }
    }


    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        request.getSession().invalidate(); // 세션 무효화
        SecurityContextHolder.clearContext(); // SecurityContextHolder 클리어
        return ResponseEntity.ok(Map.of("success", true, "message", "Admin logout successful"));
    }

}
