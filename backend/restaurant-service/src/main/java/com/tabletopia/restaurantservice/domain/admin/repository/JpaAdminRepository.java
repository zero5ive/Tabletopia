package com.tabletopia.restaurantservice.domain.admin.repository;


import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface JpaAdminRepository extends JpaRepository<Admin, Long> {
    Optional<Admin> findByEmail(String email);
    Page<Admin> findByRoleNotOrderByNameAsc(Role role, Pageable pageable);
}
