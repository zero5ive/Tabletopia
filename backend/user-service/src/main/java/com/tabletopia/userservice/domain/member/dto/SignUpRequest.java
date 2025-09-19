package com.tabletopia.userservice.domain.member.dto;

import com.tabletopia.userservice.domain.member.entity.Member;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

/**
 * 회원가입 요청 dto
 *
 * @author 김예진
 * @since 2025-08-20
 */
@Getter
@Setter // toEntity() 커스텀메서드가 있으므로 @Getter @Setter 사용
public class SignUpRequest {

  // @NotEmpty : null, "" 체크 (공백문자 " "는 통과)
  // @NotBlank : null, "", " " 모두 체크
  @NotBlank(message = "이름은 필수입니다")
  private String name;

  @Email(message = "유효한 이메일 주소를 입력해주세요")
  @NotBlank(message = "이메일은 필수입니다")
  private String email;

  @NotBlank(message = "비밀번호는 필수입니다")
  @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다") // 길이 조건
  private String password;

  /**
   * DTO -> Entity 변환 메서드
   *
   * @author 김예진
   * @since 2025-08-20
   */
  public Member toEntity() {
    return Member.createMember(this.name, this.email, this.password);
  }
}