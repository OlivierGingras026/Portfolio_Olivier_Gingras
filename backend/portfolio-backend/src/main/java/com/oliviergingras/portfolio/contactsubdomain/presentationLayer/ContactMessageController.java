package com.oliviergingras.portfolio.contactsubdomain.presentationLayer;

import com.oliviergingras.portfolio.contactsubdomain.businessLayer.ContactMessageService;
import com.oliviergingras.portfolio.common.RateLimitService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/contact")
@CrossOrigin(origins = "*")
public class ContactMessageController {
    
    private final ContactMessageService contactMessageService;
    private final RateLimitService rateLimitService;
    
    public ContactMessageController(
        ContactMessageService contactMessageService,
        RateLimitService rateLimitService
    ) {
        this.contactMessageService = contactMessageService;
        this.rateLimitService = rateLimitService;
    }
    
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(
        @RequestBody ContactMessageRequestModel requestModel
    ) {
        // Check rate limit
        if (rateLimitService.isContactLimited()) {
            long secondsRemaining = rateLimitService.getContactSecondsRemaining();
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                .body(Map.of(
                    "error", "Rate limit exceeded. Please try again in " + secondsRemaining + " seconds.",
                    "secondsRemaining", secondsRemaining
                ));
        }
        
        try {
            // Send message
            ContactMessageResponseModel response = contactMessageService.sendMessage(requestModel);
            
            // Increment counter after successful send
            rateLimitService.incrementContactCount();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/rate-limit")
    public ResponseEntity<Map<String, Object>> getRateLimit() {
        int currentCount = rateLimitService.getContactCount();
        int maxLimit = 20;
        long secondsRemaining = rateLimitService.getContactSecondsRemaining();
        boolean isLimited = rateLimitService.isContactLimited();
        
        return ResponseEntity.ok(Map.of(
            "currentCount", currentCount,
            "maxLimit", maxLimit,
            "secondsUntilReset", secondsRemaining,
            "isLimited", isLimited
        ));
    }
    
    @GetMapping
    public ResponseEntity<List<ContactMessageResponseModel>> getAllMessages() {
        List<ContactMessageResponseModel> messages = contactMessageService.getAllMessages();
        return ResponseEntity.ok(messages);
    }
    
    @GetMapping("/{messageId}")
    public ResponseEntity<ContactMessageResponseModel> getMessageById(@PathVariable String messageId) {
        try {
            ContactMessageResponseModel message = contactMessageService.getMessageById(messageId);
            return ResponseEntity.ok(message);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @DeleteMapping("/{messageId}")
    public ResponseEntity<Void> deleteMessage(@PathVariable String messageId) {
        try {
            contactMessageService.deleteMessage(messageId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping("/{messageId}/mark-as-read")
    public ResponseEntity<Void> markAsRead(@PathVariable String messageId) {
        try {
            contactMessageService.markAsRead(messageId);
            return ResponseEntity.noContent().build();
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
