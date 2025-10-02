package com.tabletopia.userservice.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.function.Function;

/**
 * JWT(JSON Web Token) 처리를 위한 유틸리티 클래스입니다.
 * 토큰 생성, 사용자 이름 추출, 유효성 검사 등의 기능을 제공합니다.
 *
 * @author 이세형
 * @since 2025-10-01
 */
@Component
public class JwtUtil {

    // TODO: Should be externalized
    private final SecretKey SECRET_KEY = Keys.hmacShaKeyFor("secretsecretsecretsecretsecretsecretsecretsecret".getBytes());

    public String extractUsername(String token) {
        return extractClaim(token, Claims::getSubject);
    }

    public Date extractExpiration(String token) {
        return extractClaim(token, Claims::getExpiration);
    }

    public <T> T extractClaim(String token, Function<Claims, T> claimsResolver) {
        final Claims claims = extractAllClaims(token);
        return claimsResolver.apply(claims);
    }

    private Claims extractAllClaims(String token) {
        return Jwts.parser().verifyWith(SECRET_KEY).build().parseSignedClaims(token).getPayload();
    }

    private Boolean isTokenExpired(String token) {
        return extractExpiration(token).before(new Date());
    }

    public String generateToken(UserDetails userDetails) {
        return createToken(userDetails.getUsername());
    }

    public String generateToken(String username) {
        return createToken(username);
    }

    private String createToken(String subject) {
        return Jwts.builder().subject(subject).issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .signWith(SECRET_KEY, Jwts.SIG.HS256).compact();
    }

    public Boolean validateToken(String token, UserDetails userDetails) {
        final String username = extractUsername(token);
        return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
    }
}