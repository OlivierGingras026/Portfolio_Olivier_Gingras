package com.oliviergingras.portfolio.contactsubdomain.presentationLayer;

import com.oliviergingras.portfolio.contactsubdomain.businessLayer.ContactMessageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/contact")
@CrossOrigin(origins = "*")
public class ContactMessageController {
    
    private final ContactMessageService contactMessageService;
    
    public ContactMessageController(ContactMessageService contactMessageService) {
        this.contactMessageService = contactMessageService;
    }
    
    @PostMapping("/send")
    public ResponseEntity<ContactMessageResponseModel> sendMessage(@RequestBody ContactMessageRequestModel requestModel) {
        try {
            ContactMessageResponseModel response = contactMessageService.sendMessage(requestModel);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
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
