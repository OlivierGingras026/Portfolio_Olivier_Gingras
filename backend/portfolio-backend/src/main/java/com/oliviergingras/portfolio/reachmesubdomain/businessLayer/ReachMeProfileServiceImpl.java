package com.oliviergingras.portfolio.reachmesubdomain.businessLayer;

import com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer.ReachMeProfile;
import com.oliviergingras.portfolio.reachmesubdomain.dataAccessLayer.ReachMeProfileRepository;
import com.oliviergingras.portfolio.reachmesubdomain.mapperLayer.ReachMeProfileRequestMapper;
import com.oliviergingras.portfolio.reachmesubdomain.mapperLayer.ReachMeProfileResponseMapper;
import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileRequestModel;
import com.oliviergingras.portfolio.reachmesubdomain.presentationLayer.ReachMeProfileResponseModel;
import org.springframework.stereotype.Service;

@Service
public class ReachMeProfileServiceImpl implements ReachMeProfileService {
    
    private final ReachMeProfileRepository reachMeProfileRepository;
    private final ReachMeProfileRequestMapper requestMapper;
    private final ReachMeProfileResponseMapper responseMapper;
    
    public ReachMeProfileServiceImpl(
        ReachMeProfileRepository reachMeProfileRepository,
        ReachMeProfileRequestMapper requestMapper,
        ReachMeProfileResponseMapper responseMapper
    ) {
        this.reachMeProfileRepository = reachMeProfileRepository;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
    }
    
    @Override
    public ReachMeProfileResponseModel getProfile() {
        ReachMeProfile profile = reachMeProfileRepository.findFirstByOrderByProfileIdDesc()
            .orElseThrow(() -> new RuntimeException("Profile not found"));
        return responseMapper.toResponseModel(profile);
    }
    
    @Override
    public ReachMeProfileResponseModel updateProfile(ReachMeProfileRequestModel requestModel) {
        ReachMeProfile profile = reachMeProfileRepository.findFirstByOrderByProfileIdDesc()
            .orElse(new ReachMeProfile());
        
        profile.setEmail(requestModel.getEmail());
        profile.setBasedIn(requestModel.getBasedIn());
        profile.setAvailabilityStatus(requestModel.getAvailabilityStatus());
        
        ReachMeProfile savedProfile = reachMeProfileRepository.save(profile);
        return responseMapper.toResponseModel(savedProfile);
    }
}
