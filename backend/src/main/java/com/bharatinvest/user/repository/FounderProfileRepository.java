package com.bharatinvest.user.repository;

import com.bharatinvest.user.entity.FounderProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FounderProfileRepository extends JpaRepository<FounderProfile, Long> {
    Optional<FounderProfile> findByUserId(Long userId);
}
