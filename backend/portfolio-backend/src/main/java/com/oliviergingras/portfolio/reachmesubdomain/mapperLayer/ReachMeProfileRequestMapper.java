package com.oliviergingras.portfolio.reachmesubdomain.mapperLayer;

import com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer.ReachMeProfile;
import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileRequestModel;
import org.springframework.stereotype.Component;

@Component
public class ReachMeProfileRequestMapper {
    
    public ReachMeProfile toEntity(ReachMeProfileRequestModel requestModel) {
        if (requestModel == null) {
            return null;
        }
        
        ReachMeProfile profile = new ReachMeProfile(
            requestModel.getEmail(),
            requestModel.getBasedIn(),
            requestModel.getAvailabilityStatus()
        );
        profile.setAvailabilityStatusFr(requestModel.getAvailabilityStatusFr());
        return profile;
    }
}
