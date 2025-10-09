package com.tabletopia.restaurantservice.domain.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "restaurant")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@SQLDelete(sql = "UPDATE restaurant SET is_deleted = true WHERE id = ?")
@Where(clause = "is_deleted = false")
public class Restaurant {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(length = 100, nullable = false)
  private String name;

  @Column(length = 255, nullable = false)
  private String address;

  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal latitude;

  @Column(nullable = false, precision = 11, scale = 8)
  private BigDecimal longitude;

  @Column(name = "region_code", length = 20, nullable = false)
  private String regionCode;

  @Column(name = "phone_number", length = 20, nullable = false)
  private String phoneNumber;

  @Column(length = 255, nullable = false)
  private String description;

  @Column(name = "is_deleted", nullable = false)
  private Boolean isDeleted = false;

  @CreatedDate
  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @LastModifiedDate
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_category_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private RestaurantCategory restaurantCategory;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_account_id", nullable = false)
  @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
  private RestaurantAccount restaurantAccount;
}
