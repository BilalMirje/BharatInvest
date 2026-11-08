package com.bharatinvest.user.controller;

import com.bharatinvest.user.entity.FounderProfile;
import com.bharatinvest.user.entity.InvestorProfile;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.FounderProfileRepository;
import com.bharatinvest.user.repository.InvestorProfileRepository;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final FounderProfileRepository founderProfileRepository;
    private final InvestorProfileRepository investorProfileRepository;

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> me(Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("name", user.getName());
        response.put("email", user.getEmail());
        response.put("role", user.getRole());

        switch (user.getRole()) {
            case FOUNDER -> founderProfileRepository.findByUserId(user.getId())
                    .ifPresent(p -> response.put("profile", p));
            case INVESTOR -> investorProfileRepository.findByUserId(user.getId())
                    .ifPresent(p -> response.put("profile", p));
            default -> {}
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/profile/founder")
    public ResponseEntity<FounderProfile> updateFounderProfile(
            @RequestBody FounderProfile profile,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        FounderProfile existing = founderProfileRepository.findByUserId(user.getId())
                .orElse(FounderProfile.builder().user(user).build());

        existing.setBio(profile.getBio());
        existing.setCompanyName(profile.getCompanyName());
        existing.setPhone(profile.getPhone());

        return ResponseEntity.ok(founderProfileRepository.save(existing));
    }

    @PutMapping("/profile/investor")
    public ResponseEntity<InvestorProfile> updateInvestorProfile(
            @RequestBody InvestorProfile profile,
            Authentication auth) {
        User user = userRepository.findByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        InvestorProfile existing = investorProfileRepository.findByUserId(user.getId())
                .orElse(InvestorProfile.builder().user(user).build());

        existing.setBio(profile.getBio());
        existing.setInterestedCategories(profile.getInterestedCategories());
        existing.setMinInvestment(profile.getMinInvestment());
        existing.setMaxInvestment(profile.getMaxInvestment());

        return ResponseEntity.ok(investorProfileRepository.save(existing));
    }
}
