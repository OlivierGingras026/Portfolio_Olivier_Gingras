package com.oliviergingras.portfolio.contactsubdomain.presentationLayer;

import java.time.LocalDateTime;

public class ContactMessageResponseModel {
    private String messageId;
    private String name;
    private String email;
    private String message;
    private LocalDateTime createdAt;
    private Boolean isRead;
    
    // Constructors
    public ContactMessageResponseModel() {
    }
    
    public ContactMessageResponseModel(String messageId, String name, String email, String message, LocalDateTime createdAt, Boolean isRead) {
        this.messageId = messageId;
        this.name = name;
        this.email = email;
        this.message = message;
        this.createdAt = createdAt;
        this.isRead = isRead;
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
