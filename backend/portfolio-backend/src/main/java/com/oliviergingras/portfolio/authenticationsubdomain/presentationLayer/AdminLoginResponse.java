package com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class AdminLoginResponse {

    private String token;

    private String refreshToken;

    private String adminId;

    private String email;

    private String fullName;

    private long expiresIn;

}
