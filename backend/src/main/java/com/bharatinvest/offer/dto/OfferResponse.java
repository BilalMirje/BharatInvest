package com.bharatinvest.offer.dto;

import com.bharatinvest.offer.entity.Offer;
import com.bharatinvest.offer.entity.OfferStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class OfferResponse {
    private Long id;
    private Long businessId;
    private String businessName;
    private Long investorId;
    private String investorName;
    private Double amount;
    private Double equityPercent;
    private String message;
    private OfferStatus status;
    private LocalDateTime createdAt;

    public static OfferResponse from(Offer o) {
        OfferResponse r = new OfferResponse();
        r.setId(o.getId());
        r.setBusinessId(o.getBusiness().getId());
        r.setBusinessName(o.getBusiness().getName());
        r.setInvestorId(o.getInvestor().getId());
        r.setInvestorName(o.getInvestor().getName());
        r.setAmount(o.getAmount());
        r.setEquityPercent(o.getEquityPercent());
        r.setMessage(o.getMessage());
        r.setStatus(o.getStatus());
        r.setCreatedAt(o.getCreatedAt());
        return r;
    }
}
