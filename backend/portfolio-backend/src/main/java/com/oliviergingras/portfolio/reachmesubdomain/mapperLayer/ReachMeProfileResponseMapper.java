package com.oliviergingras.portfolio.reachmesubdomain.mapperLayer;

import com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer.ReachMeProfile;
import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileResponseModel;
import org.springframework.stereotype.Component;

@Component
public class ReachMeProfileResponseMapper {
    
    public ReachMeProfileResponseModel toResponseModel(ReachMeProfile entity) {
        if (entity == null) {
            return null;
        }
        
        return new ReachMeProfileResponseModel(
            entity.getProfileId(),
            entity.getEmail(),
            entity.getBasedIn(),
            entity.getAvailabilityStatus(),
            entity.getAvailabilityStatusFr()
        );
    }
}
