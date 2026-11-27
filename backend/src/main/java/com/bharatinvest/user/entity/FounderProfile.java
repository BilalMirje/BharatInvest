package com.bharatinvest.user.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "founder_profiles")
@Getter @Setter @NoArgsConstructor @AllArgsConstructor @Builder
public class FounderProfile {

    @Id
    private Long userId;

    @OneToOne
    @MapsId
    @JoinColumn(name = "user_id")
    private User user;

    @Column(length = 1000)
    private String bio;

    private String companyName;

    private String phone;
}
