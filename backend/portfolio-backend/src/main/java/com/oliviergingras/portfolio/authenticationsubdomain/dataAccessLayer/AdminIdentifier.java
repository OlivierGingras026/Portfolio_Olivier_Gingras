package com.oliviergingras.portfolio.authenticationsubdomain.dataAccessLayer;


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
public class AdminIdentifier {


    @Column(unique = true, nullable = false)
    private String adminId;

    public AdminIdentifier() {
        this.adminId = UUID.randomUUID().toString();
    }

}
