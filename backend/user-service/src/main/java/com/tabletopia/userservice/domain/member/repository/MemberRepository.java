package com.tabletopia.userservice.domain.member.repository;


import com.tabletopia.userservice.domain.member.entity.Member;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 회원 리포지토리
 *
 * @author 김예진
 * @since 2025-08-20
 */
public interface MemberRepository extends JpaRepository<Member, Long> {

  /**
   * 이메일로 회원 조회
   *
   * @author 김예진
   * @since 2025-08-20
   */
  Optional<Member> findByEmail(String email); // Optional: 값이 있을 수도 있고 없을 수도 있음을 명시

}