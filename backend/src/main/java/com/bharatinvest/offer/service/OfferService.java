package com.bharatinvest.offer.service;

import com.bharatinvest.business.entity.Business;
import com.bharatinvest.business.entity.BusinessStatus;
import com.bharatinvest.business.repository.BusinessRepository;
import com.bharatinvest.business.service.BusinessService;
import com.bharatinvest.chat.entity.Conversation;
import com.bharatinvest.chat.repository.ConversationRepository;
import com.bharatinvest.offer.dto.CreateOfferRequest;
import com.bharatinvest.offer.dto.OfferResponse;
import com.bharatinvest.offer.entity.Offer;
import com.bharatinvest.offer.entity.OfferStatus;
import com.bharatinvest.offer.repository.OfferRepository;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OfferService {

    private final OfferRepository offerRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final BusinessService businessService;
    private final ConversationRepository conversationRepository;

    @Transactional
    public OfferResponse createOffer(CreateOfferRequest req, String email) {
        User investor = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepository.findById(req.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (business.getStatus() != BusinessStatus.LIVE) {
            throw new RuntimeException("Business is not accepting offers");
        }

        Offer offer = Offer.builder()
                .business(business)
                .investor(investor)
                .amount(req.getAmount())
                .equityPercent(req.getEquityPercent())
                .message(req.getMessage())
                .status(OfferStatus.PENDING)
                .build();
        offer = offerRepository.save(offer);

        conversationRepository.findByBusinessIdAndInvestorId(business.getId(), investor.getId())
                .orElseGet(() -> conversationRepository.save(
                        Conversation.builder()
                                .business(business)
                                .investor(investor)
                                .founder(business.getFounder())
                                .build()
                ));

        return OfferResponse.from(offer);
    }

    public List<OfferResponse> getOffersForBusiness(Long businessId) {
        return offerRepository.findByBusinessId(businessId).stream()
                .map(OfferResponse::from)
                .collect(Collectors.toList());
    }

    public List<OfferResponse> getMyOffers(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return offerRepository.findByInvestorId(user.getId()).stream()
                .map(OfferResponse::from)
                .collect(Collectors.toList());
    }

    public List<OfferResponse> getOffersForFounder(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return offerRepository.findByBusinessFounderId(user.getId()).stream()
                .map(OfferResponse::from)
                .collect(Collectors.toList());
    }

    @Transactional
    public OfferResponse acceptOffer(Long offerId, String email) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        User founder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!offer.getBusiness().getFounder().getId().equals(founder.getId())) {
            throw new RuntimeException("Not your business");
        }

        offer.setStatus(OfferStatus.ACCEPTED);
        offerRepository.save(offer);

        businessService.markFunded(offer.getBusiness().getId());

        offerRepository.findByBusinessId(offer.getBusiness().getId()).stream()
                .filter(o -> !o.getId().equals(offerId))
                .forEach(o -> {
                    o.setStatus(OfferStatus.REJECTED);
                    offerRepository.save(o);
                });

        return OfferResponse.from(offer);
    }

    public OfferResponse rejectOffer(Long offerId, String email) {
        Offer offer = offerRepository.findById(offerId)
                .orElseThrow(() -> new RuntimeException("Offer not found"));

        User founder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!offer.getBusiness().getFounder().getId().equals(founder.getId())) {
            throw new RuntimeException("Not your business");
        }

        offer.setStatus(OfferStatus.REJECTED);
        return OfferResponse.from(offerRepository.save(offer));
    }
}
