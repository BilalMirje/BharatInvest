package com.bharatinvest.pitch.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class PitchRequest {
    @NotNull
    private Long businessId;

    @NotBlank
    private String videoUrl;

    private String cloudinaryPublicId;

    private String description;

    private String aiFeedback;
}
