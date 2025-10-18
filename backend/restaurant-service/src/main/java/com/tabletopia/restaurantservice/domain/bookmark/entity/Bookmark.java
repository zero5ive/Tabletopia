package com.tabletopia.restaurantservice.domain.bookmark.entity;

import com.tabletopia.restaurantservice.domain.restaurant.entity.Restaurant;
import com.tabletopia.restaurantservice.domain.user.entity.User;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
/**
 * 북마크 엔티티
 * @author 서예닮
 * @since 2025-10-16
 */
@Entity
@Table(name = "bookmark")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Bookmark {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "user_id", nullable = false)
  private User user;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  private Restaurant restaurant;

  @CreationTimestamp
  @Column(name = "created_at", nullable = false,  updatable = false)
  private LocalDateTime createdAt;

  @UpdateTimestamp
  @Column(name = "updated_at", nullable = false)
  private LocalDateTime updatedAt;


  public Bookmark(User user, Restaurant restaurant) {
    this.user = user;
    this.restaurant = restaurant;
  }
}
