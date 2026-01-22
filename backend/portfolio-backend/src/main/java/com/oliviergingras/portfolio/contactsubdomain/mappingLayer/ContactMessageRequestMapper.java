package com.oliviergingras.portfolio.contactsubdomain.mappingLayer;

import com.oliviergingras.portfolio.contactsubdomain.dataAccessLayer.ContactMessage;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageRequestModel;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageResponseModel;
import org.springframework.stereotype.Component;

@Component
public class ContactMessageRequestMapper {
    
    public ContactMessage toEntity(ContactMessageRequestModel requestModel) {
        if (requestModel == null) {
            return null;
        }
        
        return new ContactMessage(
            requestModel.getName(),
            requestModel.getEmail(),
            requestModel.getMessage()
        );
    }
}
