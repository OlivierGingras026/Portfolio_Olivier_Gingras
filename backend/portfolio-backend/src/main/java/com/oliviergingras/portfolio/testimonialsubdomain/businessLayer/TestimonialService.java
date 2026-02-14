package com.oliviergingras.portfolio.testimonialsubdomain.businessLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialRequestModel;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialResponseModel;
import java.util.List;

public interface TestimonialService {
    TestimonialResponseModel submitTestimonial(TestimonialRequestModel request, String clientIp);
    List<TestimonialResponseModel> getApprovedTestimonials();
    List<TestimonialResponseModel> getAllTestimonials();
    List<TestimonialResponseModel> getPendingTestimonials();
    void approveTestimonial(String testimonialId);
    void rejectTestimonial(String testimonialId);
    void updateTestimonial(String testimonialId, TestimonialRequestModel request);
    void deleteTestimonial(String testimonialId);
}
