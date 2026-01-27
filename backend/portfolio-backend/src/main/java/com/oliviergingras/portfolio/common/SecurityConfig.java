package com.oliviergingras.portfolio.common;

import com.oliviergingras.portfolio.authenticationsubdomain.businessLayer.AuthenticationService;
import com.oliviergingras.portfolio.authenticationsubdomain.presentationLayer.JwtAuthenticationFilter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.www.BasicAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import java.util.Arrays;

@Configuration
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter(AuthenticationService authenticationService) {
        return new JwtAuthenticationFilter(authenticationService);
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, JwtAuthenticationFilter jwtAuthenticationFilter) throws Exception {
        http
                // Add JWT filter BEFORE BasicAuthenticationFilter to ensure it runs early
                .addFilterBefore(jwtAuthenticationFilter, BasicAuthenticationFilter.class)
                .csrf(csrf -> csrf.disable())
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .authorizeHttpRequests(authz -> authz
                        // Public endpoints - MUST BE FIRST
                        .requestMatchers("/").permitAll()
                        .requestMatchers("/api/public/**").permitAll()
                        .requestMatchers("/api/v1/contact/send").permitAll()
                        .requestMatchers("/api/v1/reachme").permitAll()
                        .requestMatchers("/api/v1/cv").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/v1/cv/download/**").permitAll()
                        .requestMatchers("/api/v1/testimonials/submit").anonymous()
                        .requestMatchers("/api/v1/testimonials/approved").permitAll()
                        .requestMatchers("/api/admin/auth/login").permitAll()
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        // All other admin endpoints require authentication
                        .requestMatchers("/api/admin/**").authenticated()
                        .requestMatchers("/api/v1/contact").authenticated()
                        .requestMatchers("/api/v1/contact/**").authenticated()
                        .requestMatchers("/api/v1/cv/upload").authenticated()
                        .requestMatchers(HttpMethod.POST, "/api/v1/cv/**").authenticated()
                        .requestMatchers(HttpMethod.DELETE, "/api/v1/cv/**").authenticated()
                        .requestMatchers("/api/v1/testimonials").authenticated()
                        .requestMatchers("/api/v1/testimonials/pending").authenticated()
                        .requestMatchers("/api/v1/testimonials/**").authenticated()

                        // Everything else requires authentication
                        .anyRequest().authenticated()
                );

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
                "http://localhost:5173",
                "http://localhost:3000",
                "https://portfolio-frontend-8pdc.onrender.com"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
