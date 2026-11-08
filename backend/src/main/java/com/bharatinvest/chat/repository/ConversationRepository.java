package com.bharatinvest.chat.repository;

import com.bharatinvest.chat.entity.Conversation;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ConversationRepository extends JpaRepository<Conversation, Long> {
    Optional<Conversation> findByBusinessIdAndInvestorId(Long businessId, Long investorId);
    List<Conversation> findByInvestorIdOrFounderId(Long investorId, Long founderId);
}
