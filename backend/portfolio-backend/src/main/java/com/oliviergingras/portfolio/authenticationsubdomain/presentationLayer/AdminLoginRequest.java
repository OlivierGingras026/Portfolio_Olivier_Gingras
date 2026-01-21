package com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer;

import lombok.Data;

@Data
public class AdminLoginRequest {

    private String email;

    private String password;
}
