package com.oliviergingras.portfolio.projectsubdomain.dataAccessLayer;


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
public class ProjectIdentifier {


    @Column(unique = true, nullable = false)
    private String projectId;

    public ProjectIdentifier() {
        this.projectId = UUID.randomUUID().toString();
    }

}
