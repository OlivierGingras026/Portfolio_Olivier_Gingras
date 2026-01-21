package com.oliviergingras.portfolio.authenticationsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AdminRepository extends JpaRepository<Admin, Integer> {

    Optional<Admin> findAdminByAdminIdentifier_AdminId(String adminId);

    Optional<Admin> findAdminByEmail(String email);

    boolean existsAdminByEmail(String email);

    boolean existsAdminByAdminIdentifier_AdminId(String adminId);
}
