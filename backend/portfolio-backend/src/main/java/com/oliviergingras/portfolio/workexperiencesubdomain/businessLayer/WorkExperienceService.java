package com.oliviergingras.portfolio.workexperiencesubdomain.businessLayer;

import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceRequestModel;
import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceResponseModel;

import java.util.List;


public interface WorkExperienceService {

    List<WorkExperienceResponseModel> getAllWorkExperiences();
    WorkExperienceResponseModel getWorkExperienceById(String id);
    WorkExperienceResponseModel createWorkExperience(WorkExperienceRequestModel request);
    WorkExperienceResponseModel updateWorkExperience(String id, WorkExperienceRequestModel request);
    void deleteWorkExperience(String id);
}
