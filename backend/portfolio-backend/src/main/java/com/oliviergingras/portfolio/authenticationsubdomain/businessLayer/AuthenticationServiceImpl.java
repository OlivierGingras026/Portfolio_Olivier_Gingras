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

    public AuthenticationServiceImpl(AdminRepository adminRepository,
                                    PasswordEncoder passwordEncoder,
                                    @Value("${app.jwt.secret}") String jwtSecret,
                                    @Value("${app.jwt.expiration-ms:86400000}") long jwtExpirationMs) {
        this.adminRepository = adminRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtSecret = jwtSecret;
        this.jwtExpirationMs = jwtExpirationMs;
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

        return AdminLoginResponse.builder()
                .token(token)
                .adminId(admin.getAdminIdentifier().getAdminId())
                .email(admin.getEmail())
                .fullName(admin.getFullName())
                .build();
    }

    @Override
    public void logout(String adminId) {
        // In a stateless JWT architecture, logout is primarily client-side
        // This method can be extended to maintain a blacklist if needed
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
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(key)
                .compact();
    }
}
