package com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "hobbies")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Hobby {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Embedded
    private HobbyIdentifier hobbyIdentifier;

    @Column(nullable = false, length = 120)
    private String title;

    @Column(nullable = false, length = 2000)
    private String description;

    @Column(length = 120)
    private String titleFr;

    @Column(length = 2000)
    private String descriptionFr;

    @Column(nullable = false, length = 500)
    private String imageUrl;

}
