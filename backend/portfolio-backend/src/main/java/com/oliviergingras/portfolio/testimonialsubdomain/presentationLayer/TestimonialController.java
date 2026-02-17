package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.businessLayer.TestimonialService;
import com.oliviergingras.portfolio.common.RateLimitService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/testimonials")
public class TestimonialController {
    private final TestimonialService testimonialService;
    private final RateLimitService rateLimitService;

    public TestimonialController(
        TestimonialService testimonialService,
        RateLimitService rateLimitService
    ) {
        this.testimonialService = testimonialService;
        this.rateLimitService = rateLimitService;
    }

    @PostMapping("/submit")
    public ResponseEntity<?> submitTestimonial(
        @RequestBody TestimonialRequestModel request
    ) {
        try {
            // Check if testimonial submission is rate limited
            if (rateLimitService.isTestimonialLimited()) {
                long secondsRemaining = rateLimitService.getTestimonialSecondsRemaining();
                return ResponseEntity.status(429).body(
                    Map.of(
                        "error", "Rate limit exceeded",
                        "currentCount", rateLimitService.getTestimonialCount(),
                        "maxLimit", 100,
                        "secondsUntilReset", secondsRemaining,
                        "isLimited", true
                    )
                );
            }
            
            TestimonialResponseModel response = testimonialService.submitTestimonial(request);
            
            // Increment counter after successful submission
            rateLimitService.incrementTestimonialCount();
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            throw new RuntimeException("Failed to submit testimonial: " + e.getMessage());
        }
    }

    @GetMapping("/rate-limit")
    public ResponseEntity<Map<String, Object>> getRateLimit() {
        return ResponseEntity.ok(Map.of(
            "currentCount", rateLimitService.getTestimonialCount(),
            "maxLimit", 100,
            "secondsUntilReset", rateLimitService.getTestimonialSecondsRemaining(),
            "isLimited", rateLimitService.isTestimonialLimited()
        ));
    }

    @GetMapping("/approved")
    public List<TestimonialResponseModel> getApprovedTestimonials() {
        return testimonialService.getApprovedTestimonials();
    }

    @GetMapping
    public List<TestimonialResponseModel> getAllTestimonials() {
        return testimonialService.getAllTestimonials();
    }

    @GetMapping("/pending")
    public List<TestimonialResponseModel> getPendingTestimonials() {
        return testimonialService.getPendingTestimonials();
    }

    @PutMapping("/{testimonialId}/approve")
    public void approveTestimonial(@PathVariable String testimonialId) {
        testimonialService.approveTestimonial(testimonialId);
    }

    @PutMapping("/{testimonialId}/reject")
    public void rejectTestimonial(@PathVariable String testimonialId) {
        testimonialService.rejectTestimonial(testimonialId);
    }

    @PatchMapping("/{testimonialId}")
    public void updateTestimonial(
        @PathVariable String testimonialId,
        @RequestBody TestimonialRequestModel request
    ) {
        testimonialService.updateTestimonial(testimonialId, request);
    }

    @DeleteMapping("/{testimonialId}")
    public void deleteTestimonial(@PathVariable String testimonialId) {
        testimonialService.deleteTestimonial(testimonialId);
    }
}
