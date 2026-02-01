package com.oliviergingras.portfolio.authenticationsubdomain.businessLayer;


import com.oliviergingras.portfolio.authenticationsubdomain.dataAccessLayer.Admin;
import com.oliviergingras.portfolio.authenticationsubdomain.dataAccessLayer.AdminRepository;
import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginRequest;
import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.AdminLoginResponse;
import com.oliviergingras.portfolio.common.NotFoundException;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import javax.crypto.SecretKey;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;

@Service
@Transactional
public class AuthenticationServiceImpl implements AuthenticationService {

    private final AdminRepository adminRepository;
    private final PasswordEncoder passwordEncoder;
    private final String jwtSecret;
    private final long jwtExpirationMs;
    private final long refreshTokenExpirationMs;

    public AuthenticationServiceImpl(AdminRepository adminRepository,
                                    PasswordEncoder passwordEncoder,
                                    @Value("${app.jwt.secret}") String jwtSecret,
                                    @Value("${app.jwt.expiration-ms:900000}") long jwtExpirationMs,
                                    @Value("${app.jwt.refresh-expiration-ms:604800000}") long refreshTokenExpirationMs) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
        this.refreshTokenExpirationMs = refreshTokenExpirationMs;
    }

    @Override
    @Transactional(readOnly = true)
    public AdminLoginResponse login(AdminLoginRequest request) {
        Admin admin = adminRepository.findAdminByEmail(request.getEmail())
                .orElseThrow(() -> new NotFoundException("Admin not found: " + request.getEmail()));

        if (!admin.getIsActive()) {
            throw new IllegalStateException("Admin account is inactive");
        }

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password");
        }

        String token = generateToken(admin);
        String refreshToken = generateRefreshToken(admin);

        return AdminLoginResponse.builder()
                .token(token)
                .refreshToken(refreshToken)
                .adminId(admin.getAdminIdentifier().getAdminId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .expiresIn(jwtExpirationMs / 1000)
                .build();
    }

    @Override
    public void logout(String adminId) {
    }

    @Override
    @Transactional(readOnly = true)
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

            String adminId = claims.getSubject();
            Admin admin = adminRepository.findById(Integer.parseInt(adminId))
                    .orElseThrow(() -> new NotFoundException("Admin not found: " + adminId));

            String newAccessToken = generateToken(admin);
            String newRefreshToken = generateRefreshToken(admin);

            return AdminLoginResponse.builder()
                    .token(newAccessToken)
                    .refreshToken(newRefreshToken)
                    .adminId(admin.getAdminIdentifier().getAdminId())
                    .email(admin.getEmail())
                    .fullName(admin.getFullName())
                    .expiresIn(jwtExpirationMs / 1000)
                    .build();
        } catch (Exception e) {
            throw new IllegalArgumentException("Invalid or expired refresh token", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
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

    private String generateToken(Admin admin) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .subject(admin.getAdminIdentifier().getAdminId())
                .claim("email", admin.getEmail())
                .claim("fullName", admin.getFullName())
                .claim("type", "access")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }

    private String generateRefreshToken(Admin admin) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshTokenExpirationMs);
        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .subject(admin.getAdminIdentifier().getAdminId())
                .claim("type", "refresh")
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
