package com.oliviergingras.portfolio.hobbysubdomain.presentationLayer;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class HobbyRequestModel {

    @NotBlank
    @Size(max = 120)
    private String title;

    @NotBlank
    @Size(max = 2000)
    private String description;

    @NotBlank
    @Size(max = 500)
    private String imageUrl;
}
