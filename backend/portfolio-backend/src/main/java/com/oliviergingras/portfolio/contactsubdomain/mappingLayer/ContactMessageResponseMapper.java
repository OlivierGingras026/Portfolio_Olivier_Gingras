package com.oliviergingras.portfolio.contactsubdomain.mappingLayer;

import com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer.ContactMessage;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageResponseModel;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageResponseMapper {
    
    public ContactMessageResponseModel toResponseModel(ContactMessage entity) {
        if (entity == null) {
            return null;
        }
        
        return new ContactMessageResponseModel(
            entity.getMessageId(),
            entity.getName(),
            entity.getEmail(),
            entity.getMessage(),
            entity.getCreatedAt(),
            entity.getIsRead()
        );
    }
}
