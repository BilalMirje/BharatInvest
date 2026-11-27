package com.bharatinvest.business.controller;

import com.bharatinvest.business.dto.BusinessResponse;
import com.bharatinvest.business.dto.CreateBusinessRequest;
import com.bharatinvest.business.entity.Category;
import com.bharatinvest.business.service.BusinessService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/businesses")
@RequiredArgsConstructor
public class BusinessController {

    private final BusinessService businessService;

    @PostMapping
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<BusinessResponse> create(
            @Valid @RequestBody CreateBusinessRequest request,
            Authentication auth) {
        return ResponseEntity.ok(businessService.create(request, auth.getName()));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<List<BusinessResponse>> myBusinesses(Authentication auth) {
        return ResponseEntity.ok(businessService.getMyBusinesses(auth.getName()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<BusinessResponse> getById(@PathVariable Long id) {
        return ResponseEntity.ok(businessService.getById(id));
    }

    @GetMapping
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<List<BusinessResponse>> getLive(
            @RequestParam(required = false) Category category) {
        return ResponseEntity.ok(businessService.getLiveBusinesses(category));
    }
}
