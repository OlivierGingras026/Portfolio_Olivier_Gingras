package com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "contact_messages")
public class ContactMessage {
    
    @Id
    @UuidGenerator
    private String messageId;
    
    @Column(nullable = false, length = 255)
    private String name;
    
    @Column(nullable = false, length = 255)
    private String email;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String message;
    
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;
    
    @Column(nullable = false)
    private Boolean isRead = false;
    
    // Constructors
    public ContactMessage() {
    }
    
    public ContactMessage(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
        this.createdAt = LocalDateTime.now();
        this.isRead = false;
    }
    
    // Getters and Setters
    public String getMessageId() {
        return messageId;
    }
    
    public void setMessageId(String messageId) {
        this.messageId = messageId;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getMessage() {
        return message;
    }
    
    public void setMessage(String message) {
        this.message = message;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public Boolean getIsRead() {
        return isRead;
    }
    
    public void setIsRead(Boolean isRead) {
        this.isRead = isRead;
    }
}
