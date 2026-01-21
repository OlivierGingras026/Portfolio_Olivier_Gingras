package com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Integer> {

    Optional<Project> findProjectByProjectIdentifier_ProjectId(String projectId);

    boolean existsProjectByProjectIdentifier_ProjectId(String projectId);

    void deleteProjectByProjectIdentifier_ProjectId(String projectId);
}
