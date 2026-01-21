package com.oliviergingras.portfolio.projectsubdomain.mappingLayer;

import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.Project;
import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectResponseModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface ProjectResponseMapper {

    @Mappings({
            @Mapping(source = "project.projectIdentifier.projectId", target = "projectId"),
            @Mapping(source = "project.title", target = "title"),
            @Mapping(source = "project.description", target = "description"),
            @Mapping(source = "project.url", target = "url"),
            @Mapping(source = "project.imageUrl", target = "imageUrl")
    })
    ProjectResponseModel toResponseModel(Project project);

    List<ProjectResponseModel> toResponseModelList(List<Project> projects);
}
