package com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface EducationRepository extends JpaRepository<Education, Integer> {

    Optional<Education> findEducationByEducationIdentifier_EducationId(String educationId);

    boolean existsEducationByEducationIdentifier_EducationId(String educationId);

    void deleteEducationByEducationIdentifier_EducationId(String educationId);
}
