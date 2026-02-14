package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.businessLayer.TestimonialService;
import com.oliviergingras.portfolio.common.IpAddressExtractor;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/testimonials")
public class TestimonialController {
    private final TestimonialService testimonialService;
    private final IpAddressExtractor ipAddressExtractor;

    public TestimonialController(
        TestimonialService testimonialService,
        IpAddressExtractor ipAddressExtractor
    ) {
        this.testimonialService = testimonialService;
        this.ipAddressExtractor = ipAddressExtractor;
    }

    @PostMapping("/submit")
    public TestimonialResponseModel submitTestimonial(
        @RequestBody TestimonialRequestModel request,
        HttpServletRequest httpRequest
    ) {
        String clientIp = ipAddressExtractor.extractClientIp(httpRequest);
        return testimonialService.submitTestimonial(request, clientIp);
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
