package com.tabletopia.restaurantservice.domain.admin.controller;

import com.tabletopia.restaurantservice.domain.admin.dto.AdminDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminLoginDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminRegisterDTO;
import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.entity.Role;
import com.tabletopia.restaurantservice.domain.admin.repository.JpaAdminRepository;
import com.tabletopia.restaurantservice.domain.admin.service.AdminService;
import jakarta.servlet.http.HttpServletRequest;
import java.util.List;
import java.util.stream.Collectors;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
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
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@Slf4j
public class AdminController {

    private final AdminService adminService;
    private final AuthenticationManager authenticationManager;
    private final JpaAdminRepository adminRepository;


    @GetMapping("/auth/me")
    public ResponseEntity<?> getAdminInfo() {
        AdminDTO adminDTO = adminService.getAdminByEmail();
        return ResponseEntity.ok(Map.of("admin", adminDTO));
    }

    @PostMapping("/auth/register")
    public ResponseEntity<?> register(@RequestBody AdminRegisterDTO adminRegisterDTO) {
        log.debug("admin 회원가입 시도 요청이 있었습니다. email: {}", adminRegisterDTO.getEmail());
        try {
          Admin adminDTO = adminService.register(adminRegisterDTO);
          log.debug("Admin register successful for user: {}", adminRegisterDTO.getEmail());
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin registration successful", "admin", adminDTO));
        } catch (Exception e) {
            log.error("Admin registration failed", e);
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("success", false, "message", "회원가입에 실패했습니다: " + e.getMessage()));
        }
    }

    @PostMapping("/auth/login")
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


            Admin admin = adminService.getAdminEntityByEmail(adminLoginDTO.getEmail());
            log.debug("Admin login successful for user: {}", adminLoginDTO.getEmail());
            return ResponseEntity.ok(Map.of(
              "success", true,
              "message", "Admin login successful",
              "role", admin.getRole()
            ));
        } catch (Exception e) {
            log.warn("에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생에러발생");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("success", false, "message", "오류입니다.실패하였습니다."));
        }
    }


    @PostMapping("/auth/logout")
    public ResponseEntity<?> logout(HttpServletRequest request) {
        try {
            // 1. SecurityContext 먼저 클리어
            SecurityContextHolder.clearContext();

            // 2. 세션이 존재하면 무효화 (새 세션 생성 안 함)
            HttpSession session = request.getSession(false);
            if (session != null) {
                session.invalidate();
            }

            log.debug("Admin logout successful");
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin logout successful"));
        } catch (IllegalStateException e) {
            // 세션이 이미 무효화된 경우
            log.warn("Session already invalidated during logout", e);
            return ResponseEntity.ok(Map.of("success", true, "message", "Admin logout successful"));
        }
    }
  @GetMapping("/list")
  @PreAuthorize("hasRole('SUPERADMIN')")
  public ResponseEntity<Page<Admin>> getAllAdmins(
      @RequestParam(defaultValue = "0") int page,
      @RequestParam(defaultValue = "10") int size
  ) {
    Pageable pageable = PageRequest.of(page, size);
    Page<Admin> admins = adminRepository.findByRoleNotOrderByNameAsc(Role.SUPERADMIN, pageable);

    log.debug("관리자 목록 조회: page={}, size={}, totalElements={}", page, size, admins.getTotalElements());
    return ResponseEntity.ok(admins);
  }


}
