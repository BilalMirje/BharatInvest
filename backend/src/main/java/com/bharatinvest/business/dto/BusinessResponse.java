package com.bharatinvest.business.dto;

import com.bharatinvest.business.entity.Business;
import com.bharatinvest.business.entity.BusinessStatus;
import com.bharatinvest.business.entity.Category;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class BusinessResponse {
    private Long id;
    private String name;
    private Category category;
    private String description;
    private Double askAmount;
    private Double equityOffered;
    private BusinessStatus status;
    private String rejectionReason;
    private Long founderId;
    private String founderName;
    private String websiteUrl;
    private String pitchVideoUrl;
    private LocalDateTime createdAt;

    public static BusinessResponse from(Business b) {
        BusinessResponse r = new BusinessResponse();
        r.setId(b.getId());
        r.setName(b.getName());
        r.setCategory(b.getCategory());
        r.setDescription(b.getDescription());
        r.setAskAmount(b.getAskAmount());
        r.setEquityOffered(b.getEquityOffered());
        r.setStatus(b.getStatus());
        r.setRejectionReason(b.getRejectionReason());
        r.setFounderId(b.getFounder().getId());
        r.setFounderName(b.getFounder().getName());
        r.setWebsiteUrl(b.getWebsiteUrl());
        r.setCreatedAt(b.getCreatedAt());
        return r;
    }
}
