package com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface CVFileRepository extends JpaRepository<CVFile, String> {
    Optional<CVFile> findFirstByIsActiveOrderByUploadedAtDesc(Boolean isActive);
    Optional<CVFile> findFirstByIsActiveAndIsFrenchOrderByUploadedAtDesc(Boolean isActive, Boolean isFrench);
    Optional<CVFile> findFirstByIsFrench(Boolean isFrench);
}
