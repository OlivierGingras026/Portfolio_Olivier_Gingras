package com.oliviergingras.portfolio.skillsubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class SkillResponseModel {

    private String skillId;

    private String title;

    private String description;


}
