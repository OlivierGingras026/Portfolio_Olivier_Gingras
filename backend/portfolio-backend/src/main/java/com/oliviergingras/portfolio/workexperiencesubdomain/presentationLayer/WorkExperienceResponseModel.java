package com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class WorkExperienceResponseModel {

    private String workExperienceId;

    private String company;

    private String position;

    private String description;

    private String companyFr;

    private String positionFr;

    private String descriptionFr;

    private LocalDate startDate;

    private LocalDate endDate;

    private Boolean isCurrent;

}
