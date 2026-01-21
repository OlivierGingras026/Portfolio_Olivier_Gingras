package com.oliviergingras.portfolio.hobbysubdomain.businessLayer;

import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyRequestModel;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyResponseModel;

import java.util.List;


public interface HobbyService {

    List<HobbyResponseModel> getAllHobbies();
    HobbyResponseModel getHobbyById(String id);
    HobbyResponseModel createHobby(HobbyRequestModel request);
    HobbyResponseModel updateHobby(String id, HobbyRequestModel request);
    void deleteHobby(String id);
}
