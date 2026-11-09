package com.bharatinvest.business.dto;

import com.bharatinvest.business.entity.Category;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

@Data
public class CreateBusinessRequest {
    @NotBlank
    private String name;

    @NotNull
    private Category category;

    @NotBlank
    private String description;

    @NotNull @Positive
    private Double askAmount;

    @NotNull @Positive
    private Double equityOffered;

    private String websiteUrl;
}
