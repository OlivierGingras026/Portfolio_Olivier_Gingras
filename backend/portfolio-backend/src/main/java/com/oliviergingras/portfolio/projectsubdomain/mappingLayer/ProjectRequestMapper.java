package com.oliviergingras.portfolio.projectsubdomain.mappingLayer;

import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.Project;
import com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer.ProjectIdentifier;
import com.oliviergingras.portfolio.projectsubdomain.presentationLayer.ProjectRequestModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface ProjectRequestMapper {


    @Mappings({
            @Mapping(source = "projectIdentifier", target = "projectIdentifier"),
            @Mapping(source = "requestModel.title", target = "title"),
            @Mapping(source = "requestModel.description", target = "description"),
            @Mapping(source = "requestModel.url", target = "url"),
            @Mapping(source = "requestModel.imageUrl", target = "imageUrl")
    })
    Project toEntity(ProjectRequestModel requestModel, ProjectIdentifier projectIdentifier);
}
