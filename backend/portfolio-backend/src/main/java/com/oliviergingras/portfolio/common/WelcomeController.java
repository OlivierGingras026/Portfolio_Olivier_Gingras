package com.oliviergingras.portfolio.common;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
public class WelcomeController {

    @GetMapping("/")
    public ResponseEntity<Map<String, Object>> welcome() {
        return ResponseEntity.ok(Map.of(
            "message", "Welcome to Portfolio API",
            "status", "Running",
            "version", "1.0",
            "api_endpoints", Map.of(
                "skills", "/api/public/skills",
                "projects", "/api/public/projects",
                "work_experience", "/api/public/workexperiences",
                "education", "/api/public/educations",
                "hobbies", "/api/public/hobbies",
                "login", "/api/admin/auth/login"
            )
        ));
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "UP"));
    }
}
