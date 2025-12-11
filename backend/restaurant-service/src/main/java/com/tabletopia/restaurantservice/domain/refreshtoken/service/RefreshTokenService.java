package com.tabletopia.restaurantservice.domain.refreshtoken.service;

import com.tabletopia.restaurantservice.domain.refreshtoken.entity.RefreshToken;
import com.tabletopia.restaurantservice.domain.refreshtoken.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public String createRefreshToken(String username) {

        log.debug("[RefreshTokenService] 1. RefreshToken 생성 요청 username={}", username);

        String token = UUID.randomUUID().toString();
        log.debug("[RefreshTokenService] 2. 생성된 token={}", token);

        RefreshToken refreshToken = new RefreshToken(username, token);
        log.debug("[RefreshTokenService] 3. Redis 저장 직전 refreshToken={}", refreshToken);

        refreshTokenRepository.save(refreshToken);
        log.debug("[RefreshTokenService] 4. Redis 저장 성공 username={}", username);

        return token;
    }

    public Optional<RefreshToken> validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public void deleteRefreshToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
