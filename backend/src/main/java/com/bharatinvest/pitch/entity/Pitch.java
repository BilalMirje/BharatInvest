package com.bharatinvest.pitch.entity;

import com.bharatinvest.business.entity.Business;
import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "pitches")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class Pitch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "business_id", nullable = false, unique = true)
    private Business business;

    @Column(nullable = false)
    private String videoUrl;

    private String cloudinaryPublicId;

    @Column(length = 2000)
    private String description;

    @Column(columnDefinition = "TEXT")
    private String aiFeedback;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private PitchStatus status;

    private LocalDateTime submittedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        if (status == null) status = PitchStatus.DRAFT;
    }
}
