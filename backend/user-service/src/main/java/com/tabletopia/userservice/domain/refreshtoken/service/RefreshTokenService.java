package com.tabletopia.userservice.domain.refreshtoken.service;

import com.tabletopia.userservice.domain.refreshtoken.entity.RefreshToken;
import com.tabletopia.userservice.domain.refreshtoken.repository.RefreshTokenRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    public String createRefreshToken(String username) {
        String token = UUID.randomUUID().toString();
        RefreshToken refreshToken = new RefreshToken(username, token);
        refreshTokenRepository.save(refreshToken);
        return token;
    }

    public Optional<RefreshToken> validateRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token);
    }

    public void deleteRefreshToken(String token) {
        refreshTokenRepository.findByToken(token).ifPresent(refreshTokenRepository::delete);
    }
}
