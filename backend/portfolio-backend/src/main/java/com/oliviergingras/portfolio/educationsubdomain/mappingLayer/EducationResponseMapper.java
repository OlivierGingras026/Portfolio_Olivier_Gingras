package com.oliviergingras.portfolio.educationsubdomain.mappingLayer;

import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.Education;
import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationResponseModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface EducationResponseMapper {

    @Mappings({
            @Mapping(source = "education.educationIdentifier.educationId", target = "educationId"),
            @Mapping(source = "education.school", target = "school"),
            @Mapping(source = "education.degree", target = "degree"),
            @Mapping(source = "education.description", target = "description"),
            @Mapping(source = "education.schoolFr", target = "schoolFr"),
            @Mapping(source = "education.degreeFr", target = "degreeFr"),
            @Mapping(source = "education.descriptionFr", target = "descriptionFr"),
            @Mapping(source = "education.startDate", target = "startDate"),
            @Mapping(source = "education.endDate", target = "endDate"),
            @Mapping(source = "education.isCurrentlyStudying", target = "isCurrentlyStudying")
    })
    EducationResponseModel toResponseModel(Education education);

    List<EducationResponseModel> toResponseModelList(List<Education> educations);
}
