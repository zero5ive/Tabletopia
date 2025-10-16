package com.tabletopia.restaurantservice.util;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

public class SecurityUtil {

    private SecurityUtil() { }

    /**
     * SecurityContext에서 현재 인증된 사용자의 이메일을 가져옵니다.
     * @return 현재 사용자의 이메일
     * @throws RuntimeException 인증 정보가 SecurityContext에 없는 경우
     */
    public static String getCurrentUserEmail() {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            throw new RuntimeException("Security Context에 인증 정보가 없습니다.");
        }

        return authentication.getName();
    }
}
