package com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class WorkExperienceRequestModel {

    @NotBlank
    @Size(max = 120)
    private String company;

    @NotBlank
    @Size(max = 120)
    private String position;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @Size(max = 120)
    private String companyFr;

    @Size(max = 120)
    private String positionFr;

    @Size(max = 2000)
    private String descriptionFr;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private Boolean isCurrent;
}
