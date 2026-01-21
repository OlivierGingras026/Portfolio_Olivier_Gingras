package com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer;


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
public class EducationIdentifier {


    @Column(unique = true, nullable = false)
    private String educationId;

    public EducationIdentifier() {
        this.educationId = UUID.randomUUID().toString();
    }

}
