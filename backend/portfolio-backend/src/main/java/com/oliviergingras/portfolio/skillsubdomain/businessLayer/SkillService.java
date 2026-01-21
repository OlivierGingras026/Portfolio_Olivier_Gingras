package com.oliviergingras.portfolio.skillsubdomain.businessLayer;

import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillRequestModel;
import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillResponseModel;

import java.util.List;


public interface SkillService {

    List<SkillResponseModel> getAllSkills();
    SkillResponseModel getSkillById(String id);
    SkillResponseModel createSkill(SkillRequestModel request);
    SkillResponseModel updateSkill(String id, SkillRequestModel request);
    void deleteSkill(String id);
}
