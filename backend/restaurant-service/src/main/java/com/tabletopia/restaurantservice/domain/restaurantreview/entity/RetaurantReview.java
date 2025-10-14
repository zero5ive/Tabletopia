package com.tabletopia.restaurantservice.domain.restaurantreview.entity;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "restaurant_review")
@Getter
@NoArgsConstructor
public class RetaurantReview {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "user_id", nullable = false)
  private Long userId;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  private Restaurant restaurant;

  @Column(nullable = false)
  private Integer rating;

  @Column(nullable = false, columnDefinition = "TEXT")
  private String comment;

  @Column(name = "source_id", nullable = false)
  private Long sourceId;

  @Enumerated(EnumType.STRING)
  @Column(name = "source_type")
  private SourceType sourceType;

  @Column(name = "is_deleted", nullable = false)
  private Boolean isDeleted = false;

  @Column(name = "created_at", nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;

  public enum SourceType {
    RESERVATION,
    WAITING
  }

}
