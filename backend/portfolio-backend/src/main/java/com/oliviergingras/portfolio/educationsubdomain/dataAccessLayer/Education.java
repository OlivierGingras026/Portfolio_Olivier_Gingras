package com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer;


import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "education")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Education {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Embedded
    private EducationIdentifier educationIdentifier;

    @Column(nullable = false, length = 120)
    private String school;

    @Column(nullable = false, length = 120)
    private String degree;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column
    private LocalDate endDate;

    @Column(nullable = false)
    private Boolean isCurrentlyStudying;

}
