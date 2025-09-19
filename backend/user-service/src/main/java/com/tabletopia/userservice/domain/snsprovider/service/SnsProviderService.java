package com.tabletopia.userservice.domain.snsprovider.service;

import com.tabletopia.userservice.domain.snsprovider.entity.SnsProvider;
import com.tabletopia.userservice.domain.snsprovider.repository.SnsProviderRepository;
import com.tabletopia.userservice.exception.snsprovider.SnsProviderNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * sns 제공자 서비스
 *
 * @author 김예진
 * @since 2025-08-20
 */
@Slf4j
@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
public class SnsProviderService {

  private final SnsProviderRepository snsProviderRepository;

  /**
   * sns 제공자명 조회
   *
   * @throws SnsProviderNotFoundException 해당 이름의 sns 제공자가 없는 경우
   * @author 김예진
   * @since 2025-08-20
   */
  public SnsProvider findBySnsProviderName(String snsProviderName) {
    return snsProviderRepository.findBySnsProviderName(snsProviderName)
        .orElseThrow(
            () -> new SnsProviderNotFoundException(snsProviderName + " SNS Provider를 찾을 수 없음"));
  }


}