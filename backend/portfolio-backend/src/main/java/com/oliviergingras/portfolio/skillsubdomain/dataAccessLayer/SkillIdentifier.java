package com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer;


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
public class SkillIdentifier {


    @Column(unique = true, nullable = false)
    private String skillId;

    public SkillIdentifier() {
        this.skillId = UUID.randomUUID().toString();
    }

}
