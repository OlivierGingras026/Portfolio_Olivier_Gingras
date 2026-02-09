package com.oliviergingras.portfolio.contactsubdomain.businessLayer;

import com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer.ContactMessage;
import com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer.ContactMessageRepository;
import com.oliviergingras.portfolio.contactsubdomain.mappingLayer.ContactMessageRequestMapper;
import com.oliviergingras.portfolio.contactsubdomain.mappingLayer.ContactMessageResponseMapper;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageRequestModel;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageResponseModel;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ContactMessageServiceImpl implements ContactMessageService {
    
    private final ContactMessageRepository contactMessageRepository;
    private final ContactMessageRequestMapper requestMapper;
    private final ContactMessageResponseMapper responseMapper;
    

    private static final int MAX_MESSAGES = 5;
    private static final long TIME_WINDOW_MINUTES = 20;
    
    public ContactMessageServiceImpl(
        ContactMessageRepository contactMessageRepository,
        ContactMessageRequestMapper requestMapper,
        ContactMessageResponseMapper responseMapper
    ) {
        this.contactMessageRepository = contactMessageRepository;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
    }
    
    @Override
    public ContactMessageResponseModel sendMessage(ContactMessageRequestModel requestModel) {
        // Rate limiting check
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(TIME_WINDOW_MINUTES);
        List<ContactMessage> recentMessages = contactMessageRepository.findByCreatedAtAfter(fiveMinutesAgo);
        
        if (recentMessages.size() >= MAX_MESSAGES) {
            throw new RuntimeException("Too many messages. Please try again later.");
        }
        
        // Sanitize inputs
        ContactMessage message = requestMapper.toEntity(requestModel);
        message.setName(sanitizeInput(message.getName()));
        message.setEmail(sanitizeInput(message.getEmail()));
        message.setMessage(sanitizeInput(message.getMessage()));
        
        // Validate inputs
        validateMessage(message);
        
        ContactMessage savedMessage = contactMessageRepository.save(message);
        return responseMapper.toResponseModel(savedMessage);
    }
    
    @Override
    public List<ContactMessageResponseModel> getAllMessages() {
        return contactMessageRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(responseMapper::toResponseModel)
            .collect(Collectors.toList());
    }
    
    @Override
    public ContactMessageResponseModel getMessageById(String messageId) {
        ContactMessage message = contactMessageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        return responseMapper.toResponseModel(message);
    }
    
    @Override
    public void deleteMessage(String messageId) {
        contactMessageRepository.deleteById(messageId);
    }
    
    @Override
    public void markAsRead(String messageId) {
        ContactMessage message = contactMessageRepository.findById(messageId)
            .orElseThrow(() -> new RuntimeException("Message not found"));
        message.setIsRead(true);
        contactMessageRepository.save(message);
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
    
    private void validateMessage(ContactMessage message) {
        if (message.getName() == null || message.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        
        if (message.getEmail() == null || !message.getEmail().matches("^[A-Za-z0-9+_.-]+@(.+)$")) {
            throw new RuntimeException("Valid email is required");
        }
        
        if (message.getMessage() == null || message.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }
        
        if (message.getName().length() > ContactMessageRequestModel.MAX_NAME_LENGTH) {
            throw new RuntimeException("Name must not exceed " + ContactMessageRequestModel.MAX_NAME_LENGTH + " characters");
        }
        
        if (message.getEmail().length() > ContactMessageRequestModel.MAX_EMAIL_LENGTH) {
            throw new RuntimeException("Email must not exceed " + ContactMessageRequestModel.MAX_EMAIL_LENGTH + " characters");
        }
        
        if (message.getMessage().length() > ContactMessageRequestModel.MAX_MESSAGE_CHARACTERS) {
            throw new RuntimeException("Message must not exceed " + ContactMessageRequestModel.MAX_MESSAGE_CHARACTERS + " characters (currently " + message.getMessage().length() + " characters)");
        }
    }
}
