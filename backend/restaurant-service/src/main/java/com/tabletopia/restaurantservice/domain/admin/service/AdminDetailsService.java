package com.tabletopia.restaurantservice.domain.admin.service;

import com.tabletopia.restaurantservice.domain.admin.entity.Admin;
import com.tabletopia.restaurantservice.domain.admin.repository.JpaAdminRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
public class AdminDetailsService implements UserDetailsService {

    private final JpaAdminRepository adminRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Admin admin = adminRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found with email: " + email));

        return new org.springframework.security.core.userdetails.User(admin.getEmail(), admin.getPassword(), new ArrayList<>());
    }
}
