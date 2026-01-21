package com.oliviergingras.portfolio.educationsubdomain.businessLayer;

import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationRequestModel;
import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationResponseModel;

import java.util.List;


public interface EducationService {

    List<EducationResponseModel> getAllEducations();
    EducationResponseModel getEducationById(String id);
    EducationResponseModel createEducation(EducationRequestModel request);
    EducationResponseModel updateEducation(String id, EducationRequestModel request);
    void deleteEducation(String id);
}
