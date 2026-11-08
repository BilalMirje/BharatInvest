package com.bharatinvest.business.controller;

import com.bharatinvest.business.dto.BusinessResponse;
import com.bharatinvest.business.service.BusinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/public")
@RequiredArgsConstructor
public class PublicBusinessController {

    private final BusinessService businessService;

    @GetMapping("/businesses")
    public ResponseEntity<List<BusinessResponse>> getPublicBusinesses() {
        return ResponseEntity.ok(businessService.getPublicBusinesses());
    }
}
