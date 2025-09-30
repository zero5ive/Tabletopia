package com.tabletopia.userservice.domain.user.entity;

import jakarta.persistence.*;
import lombok.Data;

@Data
@Entity
@Table()
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String username;
    private String password;
    private String email;
}
