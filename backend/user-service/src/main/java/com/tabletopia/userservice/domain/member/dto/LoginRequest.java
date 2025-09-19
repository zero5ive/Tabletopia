package com.tabletopia.userservice.domain.member.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 로그인 요청 dto
 *
 * @author 김예진
 * @since 2025-08-20
 */
@Data // 단순 요청/응답 DTO는 @Data 사용
@NoArgsConstructor
@AllArgsConstructor
public class LoginRequest {

  private String email;
  private String password;
}
