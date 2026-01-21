package com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Integer> {

    Optional<WorkExperience> findWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(String workExperienceId);

    boolean existsWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(String workExperienceId);

    void deleteWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(String workExperienceId);
}
