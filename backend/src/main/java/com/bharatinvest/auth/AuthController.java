package com.bharatinvest.auth;

import com.bharatinvest.auth.dto.AuthResponse;
import com.bharatinvest.auth.dto.LoginRequest;
import com.bharatinvest.auth.dto.RegisterRequest;
import com.bharatinvest.config.JwtService;
import com.bharatinvest.user.entity.Role;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.entity.FounderProfile;
import com.bharatinvest.user.entity.InvestorProfile;
import com.bharatinvest.user.repository.UserRepository;
import com.bharatinvest.user.repository.FounderProfileRepository;
import com.bharatinvest.user.repository.InvestorProfileRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final UserRepository userRepository;
    private final FounderProfileRepository founderProfileRepository;
    private final InvestorProfileRepository investorProfileRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;
    private final UserDetailsService userDetailsService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email already registered");
        }

        if (request.getRole() == Role.ADMIN) {
            return ResponseEntity.badRequest().body("Cannot register as ADMIN");
        }

        boolean isInvestor = request.getRole() == Role.INVESTOR;

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(request.getRole())
                .approved(!isInvestor)
                .build();
        user = userRepository.save(user);

        if (request.getRole() == Role.FOUNDER) {
            founderProfileRepository.save(FounderProfile.builder().user(user).build());
        } else if (isInvestor) {
            investorProfileRepository.save(InvestorProfile.builder().user(user).build());
        }

        if (isInvestor) {
            return ResponseEntity.ok(Map.of(
                    "message", "Registration successful. Your account is pending admin approval.",
                    "approved", false));
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
                token, user.getId(), user.getName(), user.getEmail(), user.getRole()
        ));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!Boolean.TRUE.equals(user.getApproved())) {
            return ResponseEntity.status(403).body(Map.of(
                    "error", "Your account is pending admin approval. Please wait."));
        }

        var userDetails = userDetailsService.loadUserByUsername(user.getEmail());
        String token = jwtService.generateToken(userDetails);

        return ResponseEntity.ok(new AuthResponse(
                token, user.getId(), user.getName(), user.getEmail(), user.getRole()
        ));
    }
}
