package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.businessLayer.TestimonialService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/testimonials")
public class TestimonialController {
    private final TestimonialService testimonialService;

    public TestimonialController(TestimonialService testimonialService) {
        this.testimonialService = testimonialService;
    }

    @PostMapping("/submit")
    public TestimonialResponseModel submitTestimonial(@RequestBody TestimonialRequestModel request) {
        return testimonialService.submitTestimonial(request);
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

    @DeleteMapping("/{testimonialId}")
    public void deleteTestimonial(@PathVariable String testimonialId) {
        testimonialService.deleteTestimonial(testimonialId);
    }
}
