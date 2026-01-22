package com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ReachMeProfileRepository extends JpaRepository<ReachMeProfile, String> {
    Optional<ReachMeProfile> findFirstByOrderByProfileIdDesc();
}
