package com.tabletopia.userservice.domain.snsprovider.repository;

import com.tabletopia.userservice.domain.snsprovider.entity.SnsProvider;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * SnsProvider테이블에서 select
 * 어떤 소셜로그인을 사용했는지 조회가 가능
 *
 * @author 이세형
 * @since 2025-09-25
 * */
public interface JpaSnsProviderRepository extends JpaRepository<SnsProvider, Long> {
    //SnsProvider의 이름으로 pk값 가져오기
    public SnsProvider findByName(String name);
}
