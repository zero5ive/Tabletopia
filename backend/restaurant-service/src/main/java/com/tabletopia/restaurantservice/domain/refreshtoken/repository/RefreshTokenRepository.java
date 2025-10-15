package com.tabletopia.restaurantservice.domain.refreshtoken.repository;

import com.tabletopia.restaurantservice.domain.refreshtoken.entity.RefreshToken;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface RefreshTokenRepository extends CrudRepository<RefreshToken, String> {
    Optional<RefreshToken> findByToken(String token);
}
