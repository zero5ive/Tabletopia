package com.tabletopia.userservice.domain.snsprovider.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

/**
 * sns 제공자 엔티티
 *
 * @author 김예진
 * @since 2025-08-20
 */
@Entity
@Table(name = "sns_provider")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class SnsProvider {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "sns_provider_id")
  private Long snsProviderId;

  @Column(name = "sns_provider_name")
  private String snsProviderName;
}
