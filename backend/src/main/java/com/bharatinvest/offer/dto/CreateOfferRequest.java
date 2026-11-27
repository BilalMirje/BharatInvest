package com.bharatinvest.offer.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateOfferRequest {
    @NotNull
    private Long businessId;

    @NotNull @Positive
    private Double amount;

    @NotNull @Positive
    private Double equityPercent;

    private String message;
}
