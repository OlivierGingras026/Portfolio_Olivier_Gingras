package com.oliviergingras.portfolio.hobbysubdomain.businessLayer;

import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyRequestModel;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyResponseModel;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;


public interface HobbyService {

    List<HobbyResponseModel> getAllHobbies();
    HobbyResponseModel getHobbyById(String id);
    HobbyResponseModel createHobby(HobbyRequestModel request);
    HobbyResponseModel updateHobby(String id, HobbyRequestModel request);
    void deleteHobby(String id);
}
