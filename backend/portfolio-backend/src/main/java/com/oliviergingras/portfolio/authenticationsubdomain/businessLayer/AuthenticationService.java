package com.oliviergingras.portfolio.authenticationsubdomain.businessLayer;

import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginRequest;
import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginResponse;

public interface AuthenticationService {

    AdminLoginResponse login(AdminLoginRequest request);

    void logout(String adminId);

    boolean verifyToken(String token);

    String extractAdminIdFromToken(String token);
}
