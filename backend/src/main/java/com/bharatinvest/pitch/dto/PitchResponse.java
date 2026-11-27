package com.bharatinvest.pitch.dto;

import com.bharatinvest.pitch.entity.Pitch;
import com.bharatinvest.pitch.entity.PitchStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class PitchResponse {
    private Long id;
    private Long businessId;
    private String videoUrl;
    private String description;
    private String aiFeedback;
    private PitchStatus status;
    private LocalDateTime submittedAt;
    private LocalDateTime createdAt;

    public static PitchResponse from(Pitch p) {
        PitchResponse r = new PitchResponse();
        r.setId(p.getId());
        r.setBusinessId(p.getBusiness().getId());
        r.setVideoUrl(p.getVideoUrl());
        r.setDescription(p.getDescription());
        r.setAiFeedback(p.getAiFeedback());
        r.setStatus(p.getStatus());
        r.setSubmittedAt(p.getSubmittedAt());
        r.setCreatedAt(p.getCreatedAt());
        return r;
    }
}
