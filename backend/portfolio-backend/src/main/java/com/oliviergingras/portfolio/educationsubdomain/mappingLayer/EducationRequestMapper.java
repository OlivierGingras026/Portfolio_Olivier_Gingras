package com.oliviergingras.portfolio.educationsubdomain.mappingLayer;

import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.Education;
import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.EducationIdentifier;
import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationRequestModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface EducationRequestMapper {


    @Mappings({
            @Mapping(source = "educationIdentifier", target = "educationIdentifier"),
            @Mapping(source = "requestModel.school", target = "school"),
            @Mapping(source = "requestModel.degree", target = "degree"),
            @Mapping(source = "requestModel.description", target = "description"),
            @Mapping(source = "requestModel.startDate", target = "startDate"),
            @Mapping(source = "requestModel.endDate", target = "endDate"),
            @Mapping(source = "requestModel.isCurrentlyStudying", target = "isCurrentlyStudying")
    })
    Education toEntity(EducationRequestModel requestModel, EducationIdentifier educationIdentifier);
}
