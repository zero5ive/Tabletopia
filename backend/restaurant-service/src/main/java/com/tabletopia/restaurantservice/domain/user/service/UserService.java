package com.tabletopia.restaurantservice.domain.user.service;

import com.tabletopia.restaurantservice.domain.user.dto.UserDTO;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import com.tabletopia.restaurantservice.domain.user.dto.UserInfoDTO;
import com.tabletopia.restaurantservice.domain.user.exception.UserNotFoundException;
import com.tabletopia.restaurantservice.domain.user.repository.JpaUserRepository;
import com.tabletopia.restaurantservice.util.SecurityUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

/**
 * 회원가입을 담당하는 메서드입니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Service
@RequiredArgsConstructor
public class UserService {
    private final JpaUserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public User register(UserDTO userDto) {
        User user = new User();
        user.setName(userDto.getName());
        user.setPassword(passwordEncoder.encode(userDto.getPassword())); // 암호화
        user.setEmail(userDto.getEmail());
        user.setPhoneNumber(userDto.getPhoneNumber());
        return userRepository.save(user);
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("사용자를 찾을 수 없습니다: " + email));
    }

    /**
     * 현재 인증된 사용자의 정보를 UserInfoResponse DTO로 반환합니다.
     * @return UserInfoResponse DTO
     */
    public UserInfoDTO getCurrentUserInfo() {
        String currentUserEmail = SecurityUtil.getCurrentUserEmail();
        User user = findByEmail(currentUserEmail);
        return UserInfoDTO.from(user);
    }
}

