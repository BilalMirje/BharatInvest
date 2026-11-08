package com.bharatinvest.user.repository;

import com.bharatinvest.user.entity.InvestorProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface InvestorProfileRepository extends JpaRepository<InvestorProfile, Long> {
    Optional<InvestorProfile> findByUserId(Long userId);
}
