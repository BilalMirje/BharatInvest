package com.bharatinvest.config;

import com.bharatinvest.user.entity.Role;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (!userRepository.existsByEmail("admin@bharatinvest.com")) {
            User admin = User.builder()
                    .name("Admin")
                    .email("admin@bharatinvest.com")
                    .password(passwordEncoder.encode("admin123"))
                    .role(Role.ADMIN)
                    .build();
            userRepository.save(admin);
            log.info("Default admin created: admin@bharatinvest.com / admin123");
        }
    }
}
