package com.oliviergingras.portfolio.skillsubdomain.mappingLayer;

import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.Skill;
import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillResponseModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface SkillResponseMapper {

    @Mappings({
            @Mapping(source = "skill.skillIdentifier.skillId", target = "skillId"),
            @Mapping(source = "skill.title", target = "title"),
            @Mapping(source = "skill.description", target = "description"),
            @Mapping(source = "skill.titleFr", target = "titleFr"),
            @Mapping(source = "skill.descriptionFr", target = "descriptionFr"),
            @Mapping(expression = "java(skill.getType() != null ? skill.getType().toString().toLowerCase() : \"other\")", target = "type")
    })
    SkillResponseModel toResponseModel(Skill skill);

    List<SkillResponseModel> toResponseModelList(List<Skill> skills);
}
