package com.bharatinvest.admin.controller;

import com.bharatinvest.business.dto.BusinessResponse;
import com.bharatinvest.business.service.BusinessService;
import com.bharatinvest.offer.dto.OfferResponse;
import com.bharatinvest.offer.repository.OfferRepository;
import com.bharatinvest.user.entity.Role;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BusinessService businessService;
    private final UserRepository userRepository;
    private final OfferRepository offerRepository;

    @GetMapping("/businesses/pending")
    public ResponseEntity<List<BusinessResponse>> getPending() {
        return ResponseEntity.ok(businessService.getPendingBusinesses());
    }

    @GetMapping("/businesses")
    public ResponseEntity<List<BusinessResponse>> getAll() {
        return ResponseEntity.ok(businessService.getAllBusinesses());
    }

    @PutMapping("/businesses/{id}/approve")
    public ResponseEntity<BusinessResponse> approve(@PathVariable Long id) {
        return ResponseEntity.ok(businessService.approve(id));
    }

    @PutMapping("/businesses/{id}/reject")
    public ResponseEntity<BusinessResponse> reject(
            @PathVariable Long id,
            @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(businessService.reject(id, body.get("reason")));
    }

    @DeleteMapping("/businesses/{id}")
    public ResponseEntity<?> deleteBusiness(@PathVariable Long id) {
        businessService.deleteBusiness(id);
        return ResponseEntity.ok(Map.of("message", "Business deleted"));
    }

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @GetMapping("/investors")
    public ResponseEntity<?> getInvestors() {
        List<User> investors = userRepository.findByRole(Role.INVESTOR);
        return ResponseEntity.ok(investors.stream().map(u -> Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "approved", u.getApproved(),
                "createdAt", u.getCreatedAt()
        )).collect(Collectors.toList()));
    }

    @PutMapping("/investors/{id}/approve")
    public ResponseEntity<?> approveInvestor(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(true);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Investor approved"));
    }

    @PutMapping("/investors/{id}/reject")
    public ResponseEntity<?> rejectInvestor(@PathVariable Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setApproved(false);
        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Investor rejected"));
    }

    @GetMapping("/investors/{id}/offers")
    public ResponseEntity<List<OfferResponse>> getInvestorOffers(@PathVariable Long id) {
        return ResponseEntity.ok(offerRepository.findByInvestorId(id).stream()
                .map(OfferResponse::from)
                .collect(Collectors.toList()));
    }
}
