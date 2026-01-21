package com.oliviergingras.portfolio.hobbysubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class HobbyResponseModel {

    private String hobbyId;

    private String title;

    private String description;

    private String imageUrl;

}
