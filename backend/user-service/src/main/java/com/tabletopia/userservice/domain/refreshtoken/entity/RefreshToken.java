package com.tabletopia.userservice.domain.refreshtoken.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.data.annotation.Id;
import org.springframework.data.redis.core.RedisHash;
import org.springframework.data.redis.core.index.Indexed;

@Getter
@AllArgsConstructor
@RedisHash(value = "refreshToken", timeToLive = 60 * 60 * 24 * 7) // 7 days
public class RefreshToken {

    @Id
    private String username;

    @Indexed
    private String token;
}
