package com.bharatinvest.pitch.service;

import com.bharatinvest.ai.GeminiService;
import com.bharatinvest.business.entity.Business;
import com.bharatinvest.business.entity.BusinessStatus;
import com.bharatinvest.business.repository.BusinessRepository;
import com.bharatinvest.business.service.BusinessService;
import com.bharatinvest.cloudinary.CloudinaryService;
import com.bharatinvest.pitch.dto.PitchRequest;
import com.bharatinvest.pitch.dto.PitchResponse;
import com.bharatinvest.pitch.entity.Pitch;
import com.bharatinvest.pitch.entity.PitchStatus;
import com.bharatinvest.pitch.repository.PitchRepository;
import com.bharatinvest.user.entity.User;
import com.bharatinvest.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PitchService {

    private final PitchRepository pitchRepository;
    private final BusinessRepository businessRepository;
    private final UserRepository userRepository;
    private final CloudinaryService cloudinaryService;
    private final GeminiService geminiService;
    private final BusinessService businessService;

    public PitchResponse uploadPitch(MultipartFile videoFile, Long businessId, String description, String email) throws IOException {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (!business.getFounder().getId().equals(user.getId())) {
            throw new RuntimeException("Not your business");
        }
        if (business.getStatus() != BusinessStatus.APPROVED && business.getStatus() != BusinessStatus.LIVE) {
            throw new RuntimeException("Business must be approved before uploading pitch");
        }

        Map<String, String> uploadResult = cloudinaryService.uploadVideo(videoFile);

        Pitch pitch = pitchRepository.findByBusinessId(businessId).orElse(new Pitch());
        pitch.setBusiness(business);
        pitch.setVideoUrl(uploadResult.get("url"));
        pitch.setCloudinaryPublicId(uploadResult.get("publicId"));
        pitch.setDescription(description);
        pitch.setStatus(PitchStatus.DRAFT);
        pitch.setAiFeedback(null);

        return PitchResponse.from(pitchRepository.save(pitch));
    }

    public PitchResponse savePitchUrl(PitchRequest req, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepository.findById(req.getBusinessId())
                .orElseThrow(() -> new RuntimeException("Business not found"));

        if (!business.getFounder().getId().equals(user.getId())) {
            throw new RuntimeException("Not your business");
        }
        if (business.getStatus() != BusinessStatus.APPROVED && business.getStatus() != BusinessStatus.LIVE) {
            throw new RuntimeException("Business must be approved before uploading pitch");
        }

        Pitch pitch = pitchRepository.findByBusinessId(req.getBusinessId()).orElse(new Pitch());
        pitch.setBusiness(business);
        pitch.setVideoUrl(req.getVideoUrl());
        pitch.setCloudinaryPublicId(req.getCloudinaryPublicId());
        pitch.setDescription(req.getDescription());
        pitch.setStatus(PitchStatus.DRAFT);
        if (req.getAiFeedback() != null) {
            pitch.setAiFeedback(req.getAiFeedback());
        }

        return PitchResponse.from(pitchRepository.save(pitch));
    }

    public PitchResponse analyzePitch(Long pitchId) {
        Pitch pitch = pitchRepository.findById(pitchId)
                .orElseThrow(() -> new RuntimeException("Pitch not found"));
        Business business = pitch.getBusiness();

        String feedback = geminiService.analyzePitch(
                pitch.getVideoUrl(),
                business.getName(),
                business.getDescription(),
                business.getAskAmount()
        );

        pitch.setAiFeedback(feedback);
        return PitchResponse.from(pitchRepository.save(pitch));
    }

    public String analyzeByBusiness(Long businessId, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Business business = businessRepository.findById(businessId)
                .orElseThrow(() -> new RuntimeException("Business not found"));
        if (!business.getFounder().getId().equals(user.getId())) {
            throw new RuntimeException("Not your business");
        }
        return geminiService.analyzePitch(
                "", business.getName(), business.getDescription(), business.getAskAmount());
    }

    public PitchResponse submitPitch(Long pitchId, String email) {
        Pitch pitch = pitchRepository.findById(pitchId)
                .orElseThrow(() -> new RuntimeException("Pitch not found"));

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!pitch.getBusiness().getFounder().getId().equals(user.getId())) {
            throw new RuntimeException("Not your pitch");
        }

        pitch.setStatus(PitchStatus.SUBMITTED);
        pitch.setSubmittedAt(LocalDateTime.now());
        pitchRepository.save(pitch);

        businessService.markLive(pitch.getBusiness().getId());

        return PitchResponse.from(pitch);
    }

    public PitchResponse getByBusinessId(Long businessId) {
        return pitchRepository.findByBusinessId(businessId)
                .map(PitchResponse::from)
                .orElse(null);
    }
}
