package com.oliviergingras.portfolio.projectsubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

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

    private List<String> technologies;

}
