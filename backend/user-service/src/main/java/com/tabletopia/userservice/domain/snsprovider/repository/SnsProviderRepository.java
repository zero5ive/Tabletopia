package com.tabletopia.userservice.domain.snsprovider.repository;

import com.tabletopia.userservice.domain.snsprovider.entity.SnsProvider;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * sns 제공자 리포지토리
 *
 * @author 김예진
 * @since 2025-08-20
 */
public interface SnsProviderRepository extends JpaRepository<SnsProvider, Long> {

  Optional<SnsProvider> findBySnsProviderName(String snsProviderName);

}
