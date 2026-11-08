package com.bharatinvest.business.repository;

import com.bharatinvest.business.entity.Business;
import com.bharatinvest.business.entity.BusinessStatus;
import com.bharatinvest.business.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BusinessRepository extends JpaRepository<Business, Long> {
    List<Business> findByFounderId(Long founderId);
    List<Business> findByStatus(BusinessStatus status);
    List<Business> findByStatusIn(List<BusinessStatus> statuses);
    List<Business> findByStatusAndCategory(BusinessStatus status, Category category);
    List<Business> findByCategoryAndStatusIn(Category category, List<BusinessStatus> statuses);
}
