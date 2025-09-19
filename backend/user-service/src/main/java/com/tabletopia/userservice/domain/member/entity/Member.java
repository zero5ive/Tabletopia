package com.tabletopia.userservice.domain.member.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * 사용자 엔티티
 *
 * @author 김예진
 * @since 2025-08-20
 */
@Entity
@Table(name = "member")
@Getter // @Setter 사용하지 않음 (하단 참고)
@NoArgsConstructor(access = AccessLevel.PROTECTED) // 기본 생성자 보호 (@Setter 미사용과 동일한 이유. 하단 참고)
public class Member {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "member_id")
  private Long memberId;

  private String password;

  private String name;

  private String email;

  // TODO
  // @CreationTimestamp
  // private LocalDateTime createdAt;
  //
  //  @UpdateTimestamp
  //  private LocalDateTime updatedAt;
  // 이렇게 하는게 좋을 듯
  private LocalDateTime regdate;

  /**
   * 사용자 생성 <- 메서드 기능 설명
   *
   * @param name 이름.  <- 매개변수 설명. 간단한 경우에는 필수 X
   * @return <- 반환값 설명. 간단한 경우에는 필수 X
   * @throws IllegalArgumentException 필수값이 없는 경우. <- 던지는 예외와 상황 설명
   * @author 김예진 <- 작성자
   * @since 2025-09-19 <- 작성일
   */
  public static Member createMember(String name, String email, String password) {
    // 검증로직
    if (name == null || email == null) {
      throw new IllegalArgumentException("필수값이 없습니다");
    }

    Member member = new Member();
    member.name = name;
    member.email = email;
    member.password = password;
    member.regdate = LocalDateTime.now();
    return member;
  }

  /* ============================================================
    비즈니스 로직: 도메인의 규칙과 제약사항 표현
    Setter을 사용할 경우 외부에서 검증 없이 대입할 수 있음
    Setter을 없애고 비즈니스 메서드를 두면 규칙으로 제한할 수 있음
   ============================================================== */

  /**
   * 비밀번호 변경
   *
   * @throws IllegalArgumentException 비밀번호 8자 미만인 경우
   * @author 김예진
   * @since 2024-09-19
   */
  public void changePassword(String newPassword) {
    // 도메인 규칙 검증
    if (newPassword == null || newPassword.length() < 8) {
      // IllegalArgumentException 반환
      // 적합하지 않고나 잘못된 인자를 넘겨줬을 때 던지는 예외
      throw new IllegalArgumentException("비밀번호는 8자 이상이어야 합니다");
    }

    // 검증 통과 후 변경
    this.password = newPassword;
  }

  /**
   * 개인정보 변경
   *
   * @author 김예진
   * @since 2024-09-19
   * TODO: 이름 외의 것도 수정하게 할 경우 추가
   */
  public void updateProfile(String name) {
    this.name = name;
  }
}
