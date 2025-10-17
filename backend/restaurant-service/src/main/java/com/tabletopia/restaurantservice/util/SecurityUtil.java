package com.tabletopia.restaurantservice.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@Slf4j
public class SecurityUtil {

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
        log.debug("========리턴되는 이메일0"+authentication.getName());
        return authentication.getName();
    }
}
