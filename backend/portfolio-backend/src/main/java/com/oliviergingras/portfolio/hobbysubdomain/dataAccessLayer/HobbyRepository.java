package com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface HobbyRepository extends JpaRepository<Hobby, Integer> {

    Optional<Hobby> findHobbyByHobbyIdentifier_HobbyId(String hobbyId);

    boolean existsHobbyByHobbyIdentifier_HobbyId(String hobbyId);

    void deleteHobbyByHobbyIdentifier_HobbyId(String hobbyId);
}
