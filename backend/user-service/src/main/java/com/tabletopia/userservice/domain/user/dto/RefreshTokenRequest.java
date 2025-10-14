package com.tabletopia.userservice.domain.user.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class RefreshTokenRequest {
    private String refreshToken;
}
