package com.oliviergingras.portfolio.educationsubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class EducationResponseModel {

    private String educationId;

    private String school;

    private String degree;

    private String description;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrentlyStudying;

}
