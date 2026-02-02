package com.oliviergingras.portfolio.workexperiencesubdomain.mappingLayer;

import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperience;
import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperienceIdentifier;
import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceRequestModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface WorkExperienceRequestMapper {


    @Mappings({
            @Mapping(source = "workExperienceIdentifier", target = "workExperienceIdentifier"),
            @Mapping(source = "requestModel.company", target = "company"),
            @Mapping(source = "requestModel.position", target = "position"),
            @Mapping(source = "requestModel.description", target = "description"),
            @Mapping(source = "requestModel.companyFr", target = "companyFr"),
            @Mapping(source = "requestModel.positionFr", target = "positionFr"),
            @Mapping(source = "requestModel.descriptionFr", target = "descriptionFr"),
            @Mapping(source = "requestModel.startDate", target = "startDate"),
            @Mapping(source = "requestModel.endDate", target = "endDate"),
            @Mapping(source = "requestModel.isCurrent", target = "isCurrent")
    })
    WorkExperience toEntity(WorkExperienceRequestModel requestModel, WorkExperienceIdentifier workExperienceIdentifier);
}
