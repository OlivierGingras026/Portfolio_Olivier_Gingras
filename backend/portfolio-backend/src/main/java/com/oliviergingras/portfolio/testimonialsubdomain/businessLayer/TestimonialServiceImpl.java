package com.oliviergingras.portfolio.testimonialsubdomain.businessLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer.Testimonial;
import com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer.TestimonialRepository;
import com.oliviergingras.portfolio.testimonialsubdomain.mapperLayer.TestimonialRequestMapper;
import com.oliviergingras.portfolio.testimonialsubdomain.mapperLayer.TestimonialResponseMapper;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialRequestModel;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialResponseModel;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class TestimonialServiceImpl implements TestimonialService {
    private final TestimonialRepository testimonialRepository;
    private final TestimonialRequestMapper requestMapper;
    private final TestimonialResponseMapper responseMapper;

    public TestimonialServiceImpl(TestimonialRepository testimonialRepository, TestimonialRequestMapper requestMapper, TestimonialResponseMapper responseMapper) {
        this.testimonialRepository = testimonialRepository;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
    }

    @Override
    public TestimonialResponseModel submitTestimonial(TestimonialRequestModel request) {
        // Basic validation
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new RuntimeException("Name is required");
        }
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new RuntimeException("Title is required");
        }
        if (request.getCompany() == null || request.getCompany().trim().isEmpty()) {
            throw new RuntimeException("Company is required");
        }
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new RuntimeException("Rating must be between 1 and 5");
        }
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new RuntimeException("Message is required");
        }

        Testimonial testimonial = requestMapper.toEntity(request);
        Testimonial saved = testimonialRepository.save(testimonial);
        return responseMapper.toModel(saved);
    }

    @Override
    public List<TestimonialResponseModel> getApprovedTestimonials() {
        return testimonialRepository.findByStatusOrderByCreatedAtDesc(Testimonial.TestimonialStatus.APPROVED)
            .stream()
            .map(responseMapper::toModel)
            .collect(Collectors.toList());
    }

    @Override
    public List<TestimonialResponseModel> getAllTestimonials() {
        return testimonialRepository.findAllByOrderByCreatedAtDesc()
            .stream()
            .map(responseMapper::toModel)
            .collect(Collectors.toList());
    }

    @Override
    public List<TestimonialResponseModel> getPendingTestimonials() {
        return testimonialRepository.findByStatusOrderByCreatedAtDesc(Testimonial.TestimonialStatus.PENDING)
            .stream()
            .map(responseMapper::toModel)
            .collect(Collectors.toList());
    }

    @Override
    public void approveTestimonial(String testimonialId) {
        Testimonial testimonial = testimonialRepository.findById(testimonialId)
            .orElseThrow(() -> new RuntimeException("Testimonial not found"));
        testimonial.setStatus(Testimonial.TestimonialStatus.APPROVED);
        testimonialRepository.save(testimonial);
    }

    @Override
    public void rejectTestimonial(String testimonialId) {
        Testimonial testimonial = testimonialRepository.findById(testimonialId)
            .orElseThrow(() -> new RuntimeException("Testimonial not found"));
        testimonial.setStatus(Testimonial.TestimonialStatus.REJECTED);
        testimonialRepository.save(testimonial);
    }

    @Override
    public void deleteTestimonial(String testimonialId) {
        testimonialRepository.deleteById(testimonialId);
    }
}
