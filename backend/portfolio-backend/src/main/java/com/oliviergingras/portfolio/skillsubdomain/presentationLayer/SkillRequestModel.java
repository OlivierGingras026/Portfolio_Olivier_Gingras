package com.oliviergingras.portfolio.skillsubdomain.presentationLayer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class SkillRequestModel {

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
    private String type = "other";
}
