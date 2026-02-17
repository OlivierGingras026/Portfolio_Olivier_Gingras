package com.oliviergingras.portfolio.contactsubdomain.businessLayer;

import com.oliviergingras.portfolio.common.EmailService;
import com.oliviergingras.portfolio.common.DailyContactLimitService;
import com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer.ContactMessage;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageRequestModel;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageResponseModel;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {
    
    private final EmailService emailService;
    private final DailyContactLimitService dailyLimitService;
    
    public ContactMessageServiceImpl(EmailService emailService, DailyContactLimitService dailyLimitService) {
        this.emailService = emailService;
        this.dailyLimitService = dailyLimitService;
    }
    
    @Override
    public ContactMessageResponseModel sendMessage(ContactMessageRequestModel requestModel, String clientIp) {
        // Check daily limit (max 20 messages per day)
        if (dailyLimitService.isDailyLimitExceeded()) {
            int currentCount = dailyLimitService.getTodayCount();
            throw new RuntimeException("Daily contact message limit (20) has been reached. Current count: " + currentCount + ". Please try again tomorrow.");
        }
        
        // Sanitize inputs
        String sanitizedName = sanitizeInput(requestModel.getName());
        String sanitizedEmail = sanitizeInput(requestModel.getEmail());
        String sanitizedMessage = sanitizeInput(requestModel.getMessage());
        
        // Validate inputs
        validateMessage(sanitizedName, sanitizedEmail, sanitizedMessage);
        
        // Send email directly to admin's Gmail inbox
        emailService.sendContactMessage(sanitizedName, sanitizedEmail, sanitizedMessage);
        
        // Increment daily counter
        dailyLimitService.incrementDailyCount();
        
        // Return a simple response confirming the message was sent (not stored)
        ContactMessageResponseModel response = new ContactMessageResponseModel();
        response.setMessageId("sent");
        response.setName(sanitizedName);
        response.setEmail(sanitizedEmail);
        response.setMessage(sanitizedMessage);
        response.setCreatedAt(java.time.LocalDateTime.now());
        response.setIsRead(false);
        
        return response;
    }
    
    @Override
    public List<ContactMessageResponseModel> getAllMessages() {
        // Messages are no longer stored in the database; they are sent directly to Gmail
        return java.util.Collections.emptyList();
    }
    
    @Override
    public ContactMessageResponseModel getMessageById(String messageId) {
        throw new RuntimeException("Messages are sent directly to Gmail and are no longer stored in the database");
    }
    
    @Override
    public void deleteMessage(String messageId) {
        throw new RuntimeException("Messages are no longer stored in the database");
    }
    
    @Override
    public void markAsRead(String messageId) {
        throw new RuntimeException("Messages are no longer stored in the database");
    }
    
    private String sanitizeInput(String input) {
        if (input == null || input.isEmpty()) {
            return input;
        }
        
        // Remove SQL injection patterns
        String cleaned = input.replaceAll("(--|;|\\*|/|xp_|sp_)", "");
        // Remove HTML tags and dangerous characters
        cleaned = cleaned.replaceAll("<[^>]*>", ""); // Remove HTML tags
        cleaned = cleaned.replaceAll("javascript:", ""); // Remove javascript:
        cleaned = cleaned.replaceAll("on\\w+\\s*=", ""); // Remove event handlers like onclick=
        cleaned = cleaned.trim();
        
        return cleaned;
    }
    
    private void validateMessage(String name, String email, String message) {
        if (name == null || name.trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        if (email == null || !email.matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Valid email is required");
        }
        
        if (message == null || message.trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }
        
        if (name.length() > ContactMessageRequestModel.MAX_NAME_LENGTH) {
            throw new RuntimeException("Name must not exceed " + ContactMessageRequestModel.MAX_NAME_LENGTH + " characters");
        }
        
        if (email.length() > ContactMessageRequestModel.MAX_EMAIL_LENGTH) {
            throw new RuntimeException("Email must not exceed " + ContactMessageRequestModel.MAX_EMAIL_LENGTH + " characters");
        }
        
        if (message.length() > ContactMessageRequestModel.MAX_MESSAGE_CHARACTERS) {
            throw new RuntimeException("Message must not exceed " + ContactMessageRequestModel.MAX_MESSAGE_CHARACTERS + " characters (currently " + message.length() + " characters)");
        }
    }
}
