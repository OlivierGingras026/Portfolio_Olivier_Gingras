package com.oliviergingras.portfolio.workexperiencesubdomain.mappingLayer;

import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperience;
import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceResponseModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface WorkExperienceResponseMapper {

    @Mappings({
            @Mapping(source = "workExperience.workExperienceIdentifier.workExperienceId", target = "workExperienceId"),
            @Mapping(source = "workExperience.company", target = "company"),
            @Mapping(source = "workExperience.position", target = "position"),
            @Mapping(source = "workExperience.description", target = "description"),
            @Mapping(source = "workExperience.startDate", target = "startDate"),
            @Mapping(source = "workExperience.endDate", target = "endDate"),
            @Mapping(source = "workExperience.isCurrent", target = "isCurrent")
    })
    WorkExperienceResponseModel toResponseModel(WorkExperience workExperience);

    List<WorkExperienceResponseModel> toResponseModelList(List<WorkExperience> workExperiences);
}
