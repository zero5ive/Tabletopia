package com.tabletopia.userservice.domain.user.service;

import com.tabletopia.userservice.domain.user.entity.User;
import com.tabletopia.userservice.domain.user.repository.JpaUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.DefaultOAuth2User;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.Map;
import java.util.Optional;

/**
 * OAuth2 로그인 시 사용자 정보를 로드하고, 필요한 경우 신규 사용자를 등록하는 서비스입니다.
 * Spring Security의 DefaultOAuth2UserService를 확장하여 커스텀 로직을 구현합니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final JpaUserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(userRequest);

        Map<String, Object> attributes = oAuth2User.getAttributes();
        String email = (String) attributes.get("email");
        String name = (String) attributes.get("name");

        Optional<User> userOptional = userRepository.findByEmail(email);

        User user = userOptional.orElseGet(() -> {
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setName(name);
            // Set other default fields if necessary
            return userRepository.save(newUser);
        });

        return new DefaultOAuth2User(
                Collections.emptyList(),
                attributes,
                "email");
    }
}
