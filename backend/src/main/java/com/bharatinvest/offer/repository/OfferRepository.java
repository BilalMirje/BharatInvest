package com.bharatinvest.offer.repository;

import com.bharatinvest.offer.entity.Offer;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface OfferRepository extends JpaRepository<Offer, Long> {
    List<Offer> findByBusinessId(Long businessId);
    List<Offer> findByInvestorId(Long investorId);
    List<Offer> findByBusinessFounderId(Long founderId);
}
