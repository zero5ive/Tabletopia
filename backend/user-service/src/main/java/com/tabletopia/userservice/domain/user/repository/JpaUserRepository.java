package com.tabletopia.userservice.domain.user.repository;

import com.tabletopia.userservice.domain.snsprovider.entity.SnsProvider;
import com.tabletopia.userservice.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * User정보를 조회하기 위해 사용되는 Repository
 *
 * @author 이세형
 * @since 2025-09-25
 */

public interface JpaUserRepository extends JpaRepository<User, Long> {
    //SnsProvider와 id(pk)를 통한 해당 유저 조회
    public User findBySnsProviderAndId(SnsProvider snsProvider, Long id);
}
