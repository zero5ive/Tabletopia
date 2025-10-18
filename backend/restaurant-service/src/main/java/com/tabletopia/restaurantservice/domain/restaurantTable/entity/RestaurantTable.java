package com.tabletopia.restaurantservice.domain.restaurantTable.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "restaurant_table",
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_restaurant_table_name", columnNames = {"restaurant_id", "name"})
    }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class RestaurantTable {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "restaurant_id", nullable = false)
  private Long restaurantId;

  @Column(nullable = false, length = 50)
  private String name;

  @JsonProperty("minCapacity")
  @Column(name = "min_capacity")
  private Integer minCapacity;

  @JsonProperty("maxCapacity")
  @Column(name = "max_capacity", nullable = false)
  private Integer maxCapacity;

  @JsonProperty("xPosition")
  @Column(name = "x_position", nullable = false)
  private Integer xPosition;

  @JsonProperty("yPosition")
  @Column(name = "y_position", nullable = false)
  private Integer yPosition;

  @Column(nullable = false, length = 20)
  private String shape = "RECTANGLE";

  @Column(name = "created_at", updatable = false)
  private LocalDateTime createdAt;

  @Column(name = "updated_at")
  private LocalDateTime updatedAt;

  @PrePersist
  public void onCreate() {
    this.createdAt = LocalDateTime.now();
    this.updatedAt = this.createdAt;
  }

  @PreUpdate
  public void onUpdate() {
    this.updatedAt = LocalDateTime.now();
  }
}
