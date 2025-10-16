package com.tabletopia.restaurantservice.domain.user.repository;


import com.tabletopia.restaurantservice.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaUserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    Optional<User> findById(Long id);

    User save(User user);
}
