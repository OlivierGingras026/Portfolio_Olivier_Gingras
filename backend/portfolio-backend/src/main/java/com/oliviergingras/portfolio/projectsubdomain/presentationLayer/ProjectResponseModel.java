package com.oliviergingras.portfolio.projectsubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProjectResponseModel {

    private String projectId;

    private String title;

    private String description;

    private String url;

    private String imageUrl;

}
