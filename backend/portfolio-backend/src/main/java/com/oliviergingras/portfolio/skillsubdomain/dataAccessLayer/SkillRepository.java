package com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SkillRepository extends JpaRepository<Skill, Integer> {

    Optional<Skill> findSkillBySkillIdentifier_SkillId(String skillId);

    boolean existsSkillBySkillIdentifier_SkillId(String skillId);

    void deleteSkillBySkillIdentifier_SkillId(String skillId);
}
