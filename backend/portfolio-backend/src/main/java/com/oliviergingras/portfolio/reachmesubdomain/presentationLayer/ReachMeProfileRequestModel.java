package com.oliviergingras.portfolio.reachmesubdomain.presentationLayer;

public class ReachMeProfileRequestModel {
    private String email;
    private String basedIn;
    private String availabilityStatus;
    
    // Constructors
    public ReachMeProfileRequestModel() {
    }
    
    public ReachMeProfileRequestModel(String email, String basedIn, String availabilityStatus) {
        this.email = email;
        this.basedIn = basedIn;
        this.availabilityStatus = availabilityStatus;
    }
    
    // Getters and Setters
    public String getEmail() {
        return email;
    }
    
    public void setEmail(String email) {
        this.email = email;
    }
    
    public String getBasedIn() {
        return basedIn;
    }
    
    public void setBasedIn(String basedIn) {
        this.basedIn = basedIn;
    }
    
    public String getAvailabilityStatus() {
        return availabilityStatus;
    }
    
    public void setAvailabilityStatus(String availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }
}
