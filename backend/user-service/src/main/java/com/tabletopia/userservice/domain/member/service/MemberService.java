package com.tabletopia.userservice.domain.member.service;

import com.tabletopia.userservice.domain.member.entity.Member;
import com.tabletopia.userservice.domain.member.repository.MemberRepository;
import com.tabletopia.userservice.exception.member.MemberAlreadyExistsException;
import com.tabletopia.userservice.exception.member.MemberNotFoundException;
import java.util.Optional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * 회원 서비스
 *
 * @author 김예진
 * @since 2025-09-18
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class MemberService {

  private final MemberRepository memberRepository;
  private final PasswordEncoder passwordEncoder;
//  private final SnsProviderRepository SnsProviderRepository;

  /**
   * 회원 가입
   *
   * @author 김예진
   * @since 2025-09-18
   */
  @Transactional
  public String join(Member member) {
    log.debug("member email: {}, name: {}, password: {}", member.getEmail(), member.getName(),
        member.getPassword());
    validateDuplicateMember(member); // 값 검증

    // 암호화한 값으로 비밀번호 수정
    String encodedPassword = passwordEncoder.encode(member.getPassword());
    member.changePassword(encodedPassword);

    memberRepository.save(member);
    return member.getName();
  }

  /**
   * 회원 로그인
   *
   * @throws MemberNotFoundException 회원이 존재하지 않는 경우, 비밀번호가 틀린 경우
   * @author 김예진
   * @since 2025-09-17
   */
  public Member login(String email, String password) {
    Member member = memberRepository.findByEmail(email)
        .orElseThrow(MemberNotFoundException::new); // 회원이 존재하지 않음
    // MemberNotFoundException::new -> 메서드 참조 문법 (지금은 생성자를 참조)
    // 람다 표현식 () -> new MemberNotFoundException()와 동일

    if (!passwordEncoder.matches(password, member.getPassword())) {
      throw new MemberNotFoundException(); // 비밀번호 에러 (보안상 MemberNotFoundException로 틀린게 아이디인지 비밀번호인지 파악 불가하게)
    }

    return member;
  }

  /**
   * 가입하는 회원의 정보 검증
   * <p>
   * 1. 이미 존재하는지
   *
   * @throws MemberAlreadyExistsException 이미 해당 이메일의 회원이 존재하는 경우
   * @author 김예진
   * @since 2025-09-17
   */
  private void validateDuplicateMember(Member member) {
    Optional<Member> findMember = memberRepository.findByEmail(member.getEmail());
    if (findMember.isPresent()) { // Optional 객체에 값이 존재하지 않는 경우
      throw new MemberAlreadyExistsException();
    }
  }
}