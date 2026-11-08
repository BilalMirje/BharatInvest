package com.bharatinvest.admin.controller;

import com.bharatinvest.business.dto.BusinessResponse;
import com.bharatinvest.business.service.BusinessService;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final BusinessService businessService;
    private final UserRepository userRepository;

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

    @GetMapping("/users")
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }
}
