package com.oliviergingras.portfolio.projectsubdomain.businessLayer;


import com.oliviergingras.portfolio.common.NotFoundException;
import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.Project;
import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.ProjectIdentifier;
import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.ProjectRepository;
import com.oliviergingras.portfolio.projectsubdomain.mappingLayer.ProjectRequestMapper;
import com.oliviergingras.portfolio.projectsubdomain.mappingLayer.ProjectResponseMapper;
import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectRequestModel;
import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectResponseModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class ProjectServiceImpl implements ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectResponseMapper projectResponseMapper;

    public ProjectServiceImpl(ProjectRepository projectRepository,
                             ProjectRequestMapper projectRequestMapper,
                             ProjectResponseMapper projectResponseMapper) {
        this.projectRepository = projectRepository;
        this.projectResponseMapper = projectResponseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ProjectResponseModel> getAllProjects() {
        List<Project> projects = projectRepository.findAll();
        return projectResponseMapper.toResponseModelList(projects);
    }

    @Override
    @Transactional(readOnly = true)
    public ProjectResponseModel getProjectById(String id) {
        Project project = projectRepository.findProjectByProjectIdentifier_ProjectId(id)
                .orElseThrow(() -> new NotFoundException("Project not found: " + id));

        return projectResponseMapper.toResponseModel(project);
    }

    @Override
    public ProjectResponseModel createProject(ProjectRequestModel request) {
        Project project = new Project();

        // Explicit setters (all fields)
        project.setProjectIdentifier(new ProjectIdentifier());
        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setUrl(request.getUrl());
        project.setImageUrl(request.getImageUrl());
        project.setTechnologies(request.getTechnologies());

        Project saved = projectRepository.save(project);
        return projectResponseMapper.toResponseModel(saved);
    }

    @Override
    public ProjectResponseModel updateProject(String id, ProjectRequestModel request) {
        Project existing = projectRepository.findProjectByProjectIdentifier_ProjectId(id)
                .orElseThrow(() -> new NotFoundException("Project not found: " + id));

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setUrl(request.getUrl());
        existing.setImageUrl(request.getImageUrl());
        existing.setTechnologies(request.getTechnologies());

        Project updated = projectRepository.save(existing);
        return projectResponseMapper.toResponseModel(updated);
    }


    @Override
    public void deleteProject(String id) {
        if (!projectRepository.existsProjectByProjectIdentifier_ProjectId(id)) {
            throw new NotFoundException("Project not found: " + id);
        }
        projectRepository.deleteProjectByProjectIdentifier_ProjectId(id);
    }

}
