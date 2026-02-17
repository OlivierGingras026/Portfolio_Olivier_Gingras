package com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer;

import com.oliviergingras.portfolio.authenticationsubdomain.businessLayer.AuthenticationService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final AuthenticationService authenticationService;

    public JwtAuthenticationFilter(AuthenticationService authenticationService) {
        this.authenticationService = authenticationService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String requestPath = request.getRequestURI();
        String method = request.getMethod();
        
        // Skip JWT filter for public endpoints
        if (requestPath.startsWith("/api/admin/auth/login") || 
            requestPath.startsWith("/api/public/") ||
            requestPath.equals("/") ||
            (requestPath.equals("/api/v1/contact/send") && "POST".equals(method)) ||
            (requestPath.equals("/api/v1/contact") && "GET".equals(method)) ||
            requestPath.startsWith("/api/v1/reachme") ||
            (requestPath.startsWith("/api/v1/cv") && "GET".equals(method)) ||
            requestPath.startsWith("/api/v1/cv/download") ||
            (requestPath.equals("/api/v1/testimonials/submit") && "POST".equals(method)) ||
            (requestPath.startsWith("/api/v1/testimonials/approved") && "GET".equals(method)) ||
            requestPath.startsWith("/api/admin/auth/refresh") ||
            "OPTIONS".equals(method)) {
            filterChain.doFilter(request, response);
            return;
        }

        String authHeader = request.getHeader("Authorization");

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            try {
                if (authenticationService.verifyToken(token)) {
                    String adminId = authenticationService.extractAdminIdFromToken(token);
                    GrantedAuthority authority = new SimpleGrantedAuthority("ROLE_ADMIN");
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(adminId, null, Collections.singletonList(authority));
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            } catch (Exception e) {
                logger.error("JWT filter authentication error: " + e.getMessage());
            }
        }

        filterChain.doFilter(request, response);
    }
}
