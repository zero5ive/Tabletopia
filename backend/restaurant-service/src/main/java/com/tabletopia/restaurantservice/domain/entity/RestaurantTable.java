package com.tabletopia.restaurantservice.domain.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.time.LocalDateTime;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "restaurant_table",
    uniqueConstraints = @UniqueConstraint(name = "uk_restaurant_table_name", columnNames = {"restaurant_id", "name"}),
    indexes = @Index(name = "idx_restaurant_table_capacity", columnList = "minCapacity, maxCapacity")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

  @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "restaurant_id", nullable = false)
  private Restaurant restaurant;

  @Column(nullable = false, length = 50)
  private String name;

  private Integer minCapacity;

  @Column(nullable = false)
  private Integer maxCapacity;

  @Column(nullable = false)
  private Integer xPosition;

  @Column(nullable = false)
  private Integer yPosition;

  @Column(nullable = false, length = 20)
  private String shape = "RECTANGLE";

  @Column(nullable = false, updatable = false)
  private LocalDateTime createdAt;

  @Column(nullable = false)
  private LocalDateTime updatedAt;

  @PrePersist
  void onCreate() {
    this.createdAt = this.updatedAt = LocalDateTime.now();
  }

  @PreUpdate
  void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}

