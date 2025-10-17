package com.tabletopia.restaurantservice.domain.admin.service;

import com.tabletopia.restaurantservice.domain.admin.dto.AdminDTO;
import com.tabletopia.restaurantservice.domain.admin.dto.AdminRegisterDTO;
import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.repository.JpaAdminRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AdminService {
    private final JpaAdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper; // ModelMapper 주입

    public Admin register(AdminRegisterDTO adminRegisterDTO) {
        Admin admin = new Admin();
        admin.setName(adminRegisterDTO.getName());
        admin.setEmail(adminRegisterDTO.getEmail());
        admin.setPassword(passwordEncoder.encode(adminRegisterDTO.getPassword())); // Encode password
        return adminRepository.save(admin);
    }

    /**
     * 이메일을 사용하여 관리자 정보를 조회하고 AdminDTO로 반환합니다.
     * @param email 조회할 관리자의 이메일
     * @return 조회된 관리자의 AdminDTO
     * @throws UsernameNotFoundException 해당 이메일의 관리자를 찾을 수 없는 경우
     */
    public AdminDTO getAdminByEmail() {
        AdminDTO adminDTO = new AdminDTO();
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication != null && authentication.isAuthenticated() && !"anonymousUser".equals(authentication.getPrincipal())) {
            Optional<Admin> admin = adminRepository.findByEmail(authentication.getName());
            adminDTO = modelMapper.map(admin.get(), AdminDTO.class);
            return adminDTO;
        }else return null;
    }
}

