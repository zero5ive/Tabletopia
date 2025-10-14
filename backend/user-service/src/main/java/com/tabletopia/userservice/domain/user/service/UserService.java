package com.tabletopia.userservice.domain.user.service;

import com.tabletopia.userservice.domain.user.dto.UserDTO;
import com.tabletopia.userservice.domain.user.entity.User;
import com.tabletopia.userservice.domain.user.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
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
}

