package com.oliviergingras.portfolio.reachmesubdomain.businessLayer;

import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileRequestModel;
import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileResponseModel;

public interface ReachMeProfileService {
    ReachMeProfileResponseModel getProfile();
    ReachMeProfileResponseModel updateProfile(ReachMeProfileRequestModel requestModel);
}
