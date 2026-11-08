package com.bharatinvest.offer.controller;

import com.bharatinvest.offer.dto.CreateOfferRequest;
import com.bharatinvest.offer.dto.OfferResponse;
import com.bharatinvest.offer.service.OfferService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/offers")
@RequiredArgsConstructor
public class OfferController {

    private final OfferService offerService;

    @PostMapping
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<OfferResponse> create(
            @Valid @RequestBody CreateOfferRequest request,
            Authentication auth) {
        return ResponseEntity.ok(offerService.createOffer(request, auth.getName()));
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<List<OfferResponse>> getForBusiness(@PathVariable Long businessId) {
        return ResponseEntity.ok(offerService.getOffersForBusiness(businessId));
    }

    @GetMapping("/my")
    @PreAuthorize("hasRole('INVESTOR')")
    public ResponseEntity<List<OfferResponse>> myOffers(Authentication auth) {
        return ResponseEntity.ok(offerService.getMyOffers(auth.getName()));
    }

    @GetMapping("/received")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<List<OfferResponse>> receivedOffers(Authentication auth) {
        return ResponseEntity.ok(offerService.getOffersForFounder(auth.getName()));
    }

    @PutMapping("/{id}/accept")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<OfferResponse> accept(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.acceptOffer(id, auth.getName()));
    }

    @PutMapping("/{id}/reject")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<OfferResponse> reject(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(offerService.rejectOffer(id, auth.getName()));
    }
}
