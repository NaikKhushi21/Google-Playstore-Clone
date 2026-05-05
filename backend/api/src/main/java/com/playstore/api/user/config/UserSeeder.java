package com.playstore.api.user.config;

import com.playstore.api.user.domain.Role;
import com.playstore.api.user.domain.User;
import com.playstore.api.user.repo.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class UserSeeder {

    @Bean
    @Order(1)
    CommandLineRunner seedDemoUser(UserRepository userRepository, PasswordEncoder encoder) {
        return args -> {
            String email = "demo@local.test";
            if (!userRepository.existsByEmail(email)) {
                User u = new User();
                u.setEmail(email);
                u.setPasswordHash(encoder.encode("password"));
                u.setRole(Role.USER);
                userRepository.save(u);
            }
        };
    }
}

