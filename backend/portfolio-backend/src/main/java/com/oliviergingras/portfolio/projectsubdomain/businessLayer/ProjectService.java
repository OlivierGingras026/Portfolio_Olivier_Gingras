package com.oliviergingras.portfolio.projectsubdomain.businessLayer;

import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectRequestModel;
import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectResponseModel;
import org.jspecify.annotations.Nullable;
import org.springframework.stereotype.Service;

import java.util.List;


public interface ProjectService {

    List<ProjectResponseModel> getAllProjects();
    ProjectResponseModel getProjectById(String id);
    ProjectResponseModel createProject(ProjectRequestModel request);
    ProjectResponseModel updateProject(String id, ProjectRequestModel request);
    void deleteProject(String id);
}
