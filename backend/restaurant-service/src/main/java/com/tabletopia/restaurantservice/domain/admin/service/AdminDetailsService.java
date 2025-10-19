package com.tabletopia.restaurantservice.domain.admin.service;

import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.repository.JpaAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminDetailsService implements UserDetailsService {

  private final JpaAdminRepository adminRepository;

  @Override
  public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
    Admin admin = adminRepository.findByEmail(email)
        .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + email));

    String roleName = "ROLE_" + admin.getRole().name();
    List<SimpleGrantedAuthority> authorities = List.of(new SimpleGrantedAuthority(roleName));

    System.out.println("✅ 로그인한 관리자 이메일: " + admin.getEmail());
    System.out.println("✅ 로그인한 관리자 ROLE: " + admin.getRole());
    System.out.println("✅ 부여된 권한: " + authorities);
    return new User(admin.getEmail(), admin.getPassword(), authorities);
  }
}
