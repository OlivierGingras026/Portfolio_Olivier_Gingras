package com.oliviergingras.portfolio.skillsubdomain.mappingLayer;

import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.Skill;
import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.SkillIdentifier;
import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillRequestModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface SkillRequestMapper {


    @Mappings({
            @Mapping(source = "skillIdentifier", target = "skillIdentifier"),
            @Mapping(source = "requestModel.title", target = "title"),
            @Mapping(source = "requestModel.description", target = "description"),
            @Mapping(source = "requestModel.titleFr", target = "titleFr"),
            @Mapping(source = "requestModel.descriptionFr", target = "descriptionFr"),
            @Mapping(source = "requestModel.type", target = "type")
    })
    Skill toEntity(SkillRequestModel requestModel, SkillIdentifier skillIdentifier);
}
