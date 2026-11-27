package com.bharatinvest.pitch.controller;

import com.bharatinvest.pitch.dto.PitchRequest;
import com.bharatinvest.pitch.dto.PitchResponse;
import com.bharatinvest.pitch.service.PitchService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/pitches")
@RequiredArgsConstructor
public class PitchController {

    private final PitchService pitchService;

    @PostMapping("/upload")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<PitchResponse> upload(
            @RequestParam("video") MultipartFile video,
            @RequestParam("businessId") Long businessId,
            @RequestParam(value = "description", required = false) String description,
            Authentication auth) throws Exception {
        return ResponseEntity.ok(pitchService.uploadPitch(video, businessId, description, auth.getName()));
    }

    @PostMapping("/save-url")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<PitchResponse> saveUrl(
            @Valid @RequestBody PitchRequest request,
            Authentication auth) {
        return ResponseEntity.ok(pitchService.savePitchUrl(request, auth.getName()));
    }

    @PostMapping("/{id}/analyze")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<PitchResponse> analyze(@PathVariable Long id) {
        return ResponseEntity.ok(pitchService.analyzePitch(id));
    }

    @PostMapping("/analyze-business/{businessId}")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<java.util.Map<String, String>> analyzeByBusiness(
            @PathVariable Long businessId, Authentication auth) {
        String feedback = pitchService.analyzeByBusiness(businessId, auth.getName());
        return ResponseEntity.ok(java.util.Map.of("aiFeedback", feedback));
    }


    @PostMapping("/{id}/submit")
    @PreAuthorize("hasRole('FOUNDER')")
    public ResponseEntity<PitchResponse> submit(@PathVariable Long id, Authentication auth) {
        return ResponseEntity.ok(pitchService.submitPitch(id, auth.getName()));
    }

    @GetMapping("/business/{businessId}")
    public ResponseEntity<PitchResponse> getByBusiness(@PathVariable Long businessId) {
        PitchResponse pitch = pitchService.getByBusinessId(businessId);
        return pitch != null ? ResponseEntity.ok(pitch) : ResponseEntity.notFound().build();
    }
}
