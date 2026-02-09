package com.oliviergingras.portfolio.hobbysubdomain.mappingLayer;

import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.Hobby;
import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.HobbyIdentifier;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyRequestModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

@Mapper(componentModel = "spring")
public interface HobbyRequestMapper {


    @Mappings({
            @Mapping(source = "hobbyIdentifier", target = "hobbyIdentifier"),
            @Mapping(source = "requestModel.title", target = "title"),
            @Mapping(source = "requestModel.description", target = "description"),
            @Mapping(source = "requestModel.imageUrl", target = "imageUrl")
    })
    Hobby toEntity(HobbyRequestModel requestModel, HobbyIdentifier hobbyIdentifier);
}
