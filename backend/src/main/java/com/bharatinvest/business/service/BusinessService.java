package com.bharatinvest.business.service;

import com.bharatinvest.business.dto.BusinessResponse;
import com.bharatinvest.business.dto.CreateBusinessRequest;
import com.bharatinvest.business.entity.Business;
import com.bharatinvest.business.entity.BusinessStatus;
import com.bharatinvest.business.entity.Category;
import com.bharatinvest.business.repository.BusinessRepository;
import com.bharatinvest.chat.entity.Conversation;
import com.bharatinvest.chat.repository.ChatMessageRepository;
import com.bharatinvest.chat.repository.ConversationRepository;
import com.bharatinvest.cloudinary.CloudinaryService;
import com.bharatinvest.offer.repository.OfferRepository;
import com.bharatinvest.pitch.entity.Pitch;
import com.bharatinvest.pitch.repository.PitchRepository;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BusinessService {

    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final PitchRepository pitchRepository;
    private final OfferRepository offerRepository;
    private final ConversationRepository conversationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final CloudinaryService cloudinaryService;

    public BusinessResponse create(CreateBusinessRequest req, String email) {
        User founder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Business business = Business.builder()
                .founder(founder)
                .name(req.getName())
                .category(req.getCategory())
                .description(req.getDescription())
                .askAmount(req.getAskAmount())
                .equityOffered(req.getEquityOffered())
                .websiteUrl(req.getWebsiteUrl())
                .status(BusinessStatus.PENDING)
                .build();

        return BusinessResponse.from(businessRepository.save(business));
    }

    public List<BusinessResponse> getMyBusinesses(String email) {
        User founder = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return businessRepository.findByFounderId(founder.getId()).stream()
                .map(this::toResponseWithPitch)
                .collect(Collectors.toList());
    }

    public BusinessResponse getById(Long id) {
        Business b = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        return toResponseWithPitch(b);
    }

    public List<BusinessResponse> getLiveBusinesses(Category category) {
        List<Business> list;
        if (category != null) {
            list = businessRepository.findByStatusAndCategory(BusinessStatus.LIVE, category);
        } else {
            list = businessRepository.findByStatus(BusinessStatus.LIVE);
        }
        return list.stream().map(this::toResponseWithPitch).collect(Collectors.toList());
    }

    public List<BusinessResponse> getPublicBusinesses() {
        return businessRepository.findByStatus(BusinessStatus.LIVE).stream()
                .limit(12)
                .map(b -> {
                    BusinessResponse r = BusinessResponse.from(b);
                    r.setDescription(b.getDescription().length() > 100
                            ? b.getDescription().substring(0, 100) + "..."
                            : b.getDescription());
                    return r;
                })
                .collect(Collectors.toList());
    }

    public List<BusinessResponse> getPendingBusinesses() {
        return businessRepository.findByStatus(BusinessStatus.PENDING).stream()
                .map(BusinessResponse::from)
                .collect(Collectors.toList());
    }

    public List<BusinessResponse> getAllBusinesses() {
        return businessRepository.findAll().stream()
                .map(BusinessResponse::from)
                .collect(Collectors.toList());
    }

    public BusinessResponse approve(Long id) {
        Business b = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        b.setStatus(BusinessStatus.APPROVED);
        b.setRejectionReason(null);
        return BusinessResponse.from(businessRepository.save(b));
    }

    public BusinessResponse reject(Long id, String reason) {
        Business b = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        b.setStatus(BusinessStatus.REJECTED);
        b.setRejectionReason(reason);
        return BusinessResponse.from(businessRepository.save(b));
    }

    public void markLive(Long businessId) {
        Business b = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        if (b.getStatus() == BusinessStatus.APPROVED) {
            b.setStatus(BusinessStatus.LIVE);
            businessRepository.save(b);
        }
    }

    @Transactional
    public void deleteBusiness(Long id) {
        Business b = businessRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        // 1. Delete chat messages for all conversations of this business
        List<Conversation> conversations = conversationRepository.findByBusinessId(id);
        for (Conversation conv : conversations) {
            chatMessageRepository.deleteAll(
                    chatMessageRepository.findByConversationIdOrderBySentAtAsc(conv.getId()));
        }

        // 2. Delete conversations
        conversationRepository.deleteAll(conversations);

        // 3. Delete offers
        offerRepository.deleteAll(offerRepository.findByBusinessId(id));

        // 4. Delete pitch + Cloudinary video
        pitchRepository.findByBusinessId(id).ifPresent(pitch -> {
            if (pitch.getCloudinaryPublicId() != null && !pitch.getCloudinaryPublicId().isEmpty()) {
                try {
                    cloudinaryService.deleteVideo(pitch.getCloudinaryPublicId());
                    log.info("Deleted Cloudinary video: {}", pitch.getCloudinaryPublicId());
                } catch (Exception e) {
                    log.warn("Failed to delete Cloudinary video {}: {}", pitch.getCloudinaryPublicId(), e.getMessage());
                }
            }
            pitchRepository.delete(pitch);
        });

        // 5. Delete business
        businessRepository.delete(b);
    }

    public void markFunded(Long businessId) {
        Business b = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        b.setStatus(BusinessStatus.FUNDED);
        businessRepository.save(b);
    }

    private BusinessResponse toResponseWithPitch(Business b) {
        BusinessResponse r = BusinessResponse.from(b);
        pitchRepository.findByBusinessId(b.getId())
                .ifPresent(p -> r.setPitchVideoUrl(p.getVideoUrl()));
        return r;
    }
}
