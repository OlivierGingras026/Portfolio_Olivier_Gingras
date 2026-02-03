package com.oliviergingras.portfolio.reachmesubdomain.presentationLayer;

public class ReachMeProfileResponseModel {
    private String profileId;
    private String email;
    private String basedIn;
    private String availabilityStatus;
    private String availabilityStatusFr;
    
    // Constructors
    public ReachMeProfileResponseModel() {
    }
    
    public ReachMeProfileResponseModel(String profileId, String email, String basedIn, String availabilityStatus, String availabilityStatusFr) {
        this.profileId = profileId;
        this.email = email;
        this.basedIn = basedIn;
        this.availabilityStatus = availabilityStatus;
        this.availabilityStatusFr = availabilityStatusFr;
    }
    
    // Getters and Setters
    public String getProfileId() {
        return profileId;
    }
    
    public void setProfileId(String profileId) {
        this.profileId = profileId;
    }
    
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

    public String getAvailabilityStatusFr() {
        return availabilityStatusFr;
    }

    public void setAvailabilityStatusFr(String availabilityStatusFr) {
        this.availabilityStatusFr = availabilityStatusFr;
    }
}
