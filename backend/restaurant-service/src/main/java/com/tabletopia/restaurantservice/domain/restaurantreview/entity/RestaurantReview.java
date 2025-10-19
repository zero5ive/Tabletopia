package com.tabletopia.restaurantservice.domain.restaurantreview.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.user.entity.User;
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
public class RestaurantReview {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JsonIgnore
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  @JsonIgnore
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

  /**
   * 리뷰 생성자
   * @author 서예닮
   * @since 2025-10-19
   */
  public RestaurantReview(User user, Restaurant restaurant, Integer rating, String comment,
                          Long sourceId, SourceType sourceType) {
    this.user = user;
    this.restaurant = restaurant;
    this.rating = rating;
    this.comment = comment;
    this.sourceId = sourceId;
    this.sourceType = sourceType;
    this.isDeleted = false;
    this.createdAt = LocalDateTime.now();
    this.updatedAt = LocalDateTime.now();
  }

  /**
   * 리뷰 삭제 처리 (soft delete)
   * @author 서예닮
   * @since 2025-10-19
   */
  public void setDeleted(boolean deleted) {
    this.isDeleted = deleted;
    if (deleted) {
      this.updatedAt = LocalDateTime.now();
    }
  }

}
