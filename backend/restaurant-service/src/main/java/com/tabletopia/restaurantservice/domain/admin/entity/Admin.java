package com.tabletopia.restaurantservice.domain.admin.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

/**
 * admin(지점) 정보를 나타내는 JPA 엔티티 클래스입니다.
 * 데이터베이스의 'admin' 테이블과 매핑됩니다.
 *
 * @author 이세형
 * @since 2025-10-14
 */
@Data
@Entity
@Table(name = "admin")
public class Admin {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(length = 255)
    private String password;

    @Column(nullable = false, length = 20)
    private String name;

    @Column(nullable = false)
    private boolean isDeleted = false;

    @CreationTimestamp
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
