package com.oliviergingras.portfolio.educationsubdomain.presentationLayer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EducationRequestModel {

    @NotBlank
    @Size(max = 120)
    private String school;

    @NotBlank
    @Size(max = 120)
    private String degree;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotNull
    private LocalDate startDate;

    private LocalDate endDate;

    @NotNull
    private Boolean isCurrentlyStudying;
}
