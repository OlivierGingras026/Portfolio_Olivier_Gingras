package com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer;


import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;

import java.util.UUID;

@Embeddable
@Getter
@Setter
@AllArgsConstructor
public class WorkExperienceIdentifier {


    @Column(unique = true, nullable = false)
    private String workExperienceId;

    public WorkExperienceIdentifier() {
        this.workExperienceId = UUID.randomUUID().toString();
    }

}
