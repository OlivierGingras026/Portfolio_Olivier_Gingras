package com.oliviergingras.portfolio.reachmesubdomain.presentationLayer;

import com.oliviergingras.portfolio.reachmesubdomain.businessLayer.ReachMeProfileService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/reachme")
@CrossOrigin(origins = "*")
public class ReachMeProfileController {
    
    private final ReachMeProfileService reachMeProfileService;
    
    public ReachMeProfileController(ReachMeProfileService reachMeProfileService) {
        this.reachMeProfileService = reachMeProfileService;
    }
    
    @GetMapping
    public ResponseEntity<ReachMeProfileResponseModel> getProfile() {
        try {
            ReachMeProfileResponseModel profile = reachMeProfileService.getProfile();
            return ResponseEntity.ok(profile);
        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    @PutMapping
    public ResponseEntity<ReachMeProfileResponseModel> updateProfile(@RequestBody ReachMeProfileRequestModel requestModel) {
        ReachMeProfileResponseModel profile = reachMeProfileService.updateProfile(requestModel);
        return ResponseEntity.ok(profile);
    }
}
