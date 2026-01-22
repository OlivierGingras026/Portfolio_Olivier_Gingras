package com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, String> {
    List<ContactMessage> findAllByOrderByCreatedAtDesc();
    List<ContactMessage> findByCreatedAtAfter(LocalDateTime dateTime);
}
