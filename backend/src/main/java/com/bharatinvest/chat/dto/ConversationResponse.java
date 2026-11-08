package com.bharatinvest.chat.dto;

import com.bharatinvest.chat.entity.Conversation;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ConversationResponse {
    private Long id;
    private Long businessId;
    private String businessName;
    private Long investorId;
    private String investorName;
    private Long founderId;
    private String founderName;
    private LocalDateTime createdAt;

    public static ConversationResponse from(Conversation c) {
        ConversationResponse r = new ConversationResponse();
        r.setId(c.getId());
        r.setBusinessId(c.getBusiness().getId());
        r.setBusinessName(c.getBusiness().getName());
        r.setInvestorId(c.getInvestor().getId());
        r.setInvestorName(c.getInvestor().getName());
        r.setFounderId(c.getFounder().getId());
        r.setFounderName(c.getFounder().getName());
        r.setCreatedAt(c.getCreatedAt());
        return r;
    }
}
