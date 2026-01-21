package com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer;


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
public class HobbyIdentifier {


    @Column(unique = true, nullable = false)
    private String hobbyId;

    public HobbyIdentifier() {
        this.hobbyId = UUID.randomUUID().toString();
    }

}
