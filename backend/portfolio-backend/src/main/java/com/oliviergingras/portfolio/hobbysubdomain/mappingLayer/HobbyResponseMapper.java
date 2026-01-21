package com.oliviergingras.portfolio.hobbysubdomain.mappingLayer;

import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.Hobby;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyResponseModel;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Mappings;

import java.util.List;

@Mapper(componentModel = "spring")
public interface HobbyResponseMapper {

    @Mappings({
            @Mapping(source = "hobby.hobbyIdentifier.hobbyId", target = "hobbyId"),
            @Mapping(source = "hobby.title", target = "title"),
            @Mapping(source = "hobby.description", target = "description"),
            @Mapping(source = "hobby.imageUrl", target = "imageUrl")
    })
    HobbyResponseModel toResponseModel(Hobby hobby);

    List<HobbyResponseModel> toResponseModelList(List<Hobby> hobbies);
}
