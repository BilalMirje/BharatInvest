package com.bharatinvest.pitch.repository;

import com.bharatinvest.pitch.entity.Pitch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface PitchRepository extends JpaRepository<Pitch, Long> {
    Optional<Pitch> findByBusinessId(Long businessId);
}
