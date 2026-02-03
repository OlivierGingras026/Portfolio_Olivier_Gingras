package com.oliviergingras.portfolio.contactsubdomain.presentationLayer;

public class ContactMessageRequestModel {
    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_EMAIL_LENGTH = 255;
    public static final int MAX_MESSAGE_CHARACTERS = 1000;
    
    private String name;
    private String email;
    private String message;
    
    // Constructors
    public ContactMessageRequestModel() {
    }
    
    public ContactMessageRequestModel(String name, String email, String message) {
        this.name = name;
        this.email = email;
        this.message = message;
    }
    
    // Getters and Setters
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
}
