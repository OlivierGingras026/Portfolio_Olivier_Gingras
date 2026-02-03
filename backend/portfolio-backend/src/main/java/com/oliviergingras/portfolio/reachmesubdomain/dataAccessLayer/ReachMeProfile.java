package com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer;

import jakarta.persistence.*;
import org.hibernate.annotations.UuidGenerator;

@Entity
@Table(name = "reach_me_profile")
public class ReachMeProfile {
    
    @Id
    @UuidGenerator
    private String profileId;
    
    @Column(nullable = false, length = 255)
    private String email;
    
    @Column(nullable = false, length = 255)
    private String basedIn;
    
    @Column(nullable = false, columnDefinition = "TEXT")
    private String availabilityStatus;

    @Column(nullable = true, columnDefinition = "TEXT")
    private String availabilityStatusFr;
    
    // Constructors
    public ReachMeProfile() {
    }
    
    public ReachMeProfile(String email, String basedIn, String availabilityStatus) {
        this.email = email;
        this.basedIn = basedIn;
        this.availabilityStatus = availabilityStatus;
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
