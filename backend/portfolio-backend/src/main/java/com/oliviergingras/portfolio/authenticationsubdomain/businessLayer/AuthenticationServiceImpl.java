package com.oliviergingras.portfolio.authenticationsubdomain.businessLayer;

import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginRequest;
import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginResponse;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class AuthenticationServiceImpl implements AuthenticationService {

    private final String jwtSecret;
    private final long jwtExpirationMs;
    private final long refreshTokenExpirationMs;
    private final String adminEmail;
    private final String adminPasswordHash;
    private final PasswordEncoder passwordEncoder;

    public AuthenticationServiceImpl(@Value("${app.jwt.secret}") String jwtSecret,
                                    @Value("${app.jwt.expiration-ms}") long jwtExpirationMs,
                                    @Value("${app.jwt.refresh-expiration-ms}") long refreshTokenExpirationMs,
                                    @Value("${app.admin.email}") String adminEmail,
                                    @Value("${app.admin.password}") String adminPassword,
                                    PasswordEncoder passwordEncoder) {
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
        this.adminEmail = adminEmail;
        this.passwordEncoder = passwordEncoder;
        // Hash the admin password once on initialization
        this.adminPasswordHash = passwordEncoder.encode(adminPassword);
    }

    @Override
    public AdminLoginResponse login(AdminLoginRequest request) {
        // Validate email and password using BCrypt for secure comparison
        if (!request.getEmail().equals(adminEmail) || !passwordEncoder.matches(request.getPassword(), adminPasswordHash)) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        // Generate JWT tokens
        String token = generateToken(request.getEmail());
        String refreshToken = generateRefreshToken(request.getEmail());

        return AdminLoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .adminId("admin-01")
                .email(request.getEmail())
                .fullName("Portfolio Admin")
                .expiresIn(jwtExpirationMs / 1000)
                .build();
    }

    @Override
    public void logout(String adminId) {
    }

    @Override
    public AdminLoginResponse refreshToken(String refreshToken) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(refreshToken)
                    .getPayload();

            // Verify it's a refresh token
            String tokenType = (String) claims.get("type");
            if (!"refresh".equals(tokenType)) {
                throw new IllegalArgumentException("Invalid token type");
            }

            String email = claims.getSubject();
            String newAccessToken = generateToken(email);
            String newRefreshToken = generateRefreshToken(email);

            return AdminLoginResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .adminId("admin-01")
                    .email(email)
                    .fullName("Portfolio Admin")
                    .expiresIn(jwtExpirationMs / 1000)
                    .build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired refresh token", e);
        }
    }

    @Override
    public boolean verifyToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    @Override
    public String extractAdminIdFromToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());
            Claims claims = Jwts.parser()
                    .verifyWith(key)
                    .build()
                    .parseSignedClaims(token)
                    .getPayload();

            return claims.getSubject();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid token", e);
        }
    }

    private String generateToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .subject(email)
                .claim("email", email)
                .claim("fullName", "Portfolio Admin")
                .claim("type", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    private String generateRefreshToken(String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .subject(email)
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
