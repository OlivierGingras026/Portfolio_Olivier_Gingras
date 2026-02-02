package com.oliviergingras.portfolio.projectsubdomain.presentationLayer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import java.util.List;

@Data
public class ProjectRequestModel {

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @Size(max = 120)
    private String titleFr;

    @Size(max = 2000)
    private String descriptionFr;

    @NotBlank
    @Size(max = 500)
    private String url;

    @Size(max = 5000000) // Allow up to 5MB base64 encoded images
    private String imageUrl;

    private List<String> technologies;
}
