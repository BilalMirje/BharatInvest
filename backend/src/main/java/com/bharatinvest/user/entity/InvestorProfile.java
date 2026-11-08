package com.bharatinvest.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "investor_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class InvestorProfile {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 1000)
    private String bio;

    private String interestedCategories;

    private Double minInvestment;

    private Double maxInvestment;
}
