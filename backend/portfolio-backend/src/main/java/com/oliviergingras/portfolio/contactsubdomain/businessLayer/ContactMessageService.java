package com.oliviergingras.portfolio.contactsubdomain.businessLayer;

import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageRequestModel;
import com.oliviergingras.portfolio.contactsubdomain.presentationLayer.ContactMessageResponseModel;
import java.util.List;

public interface ContactMessageService {
    ContactMessageResponseModel sendMessage(ContactMessageRequestModel requestModel, String clientIp);
    List<ContactMessageResponseModel> getAllMessages();
    ContactMessageResponseModel getMessageById(String messageId);
    void deleteMessage(String messageId);
    void markAsRead(String messageId);
}
