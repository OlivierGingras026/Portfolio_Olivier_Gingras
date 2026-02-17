package com.oliviergingras.portfolio.testimonialsubdomain.businessLayer;

import com.oliviergingras.portfolio.common.DailyTestimonialCountService;
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
    private final DailyTestimonialCountService dailyCountService;

    public TestimonialServiceImpl(
        TestimonialRepository testimonialRepository,
        TestimonialRequestMapper requestMapper,
        TestimonialResponseMapper responseMapper,
        DailyTestimonialCountService dailyCountService
    ) {
        this.testimonialRepository = testimonialRepository;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
        this.dailyCountService = dailyCountService;
    }

    @Override
    public TestimonialResponseModel submitTestimonial(TestimonialRequestModel request, String clientIp) {
        // Check daily limit (max 100 testimonials per day)
        if (dailyCountService.isDailyLimitExceeded()) {
            int currentCount = dailyCountService.getTodayCount();
            throw new RuntimeException("Daily testimonial limit (100) has been reached. Current count: " + currentCount + ". Please try again tomorrow.");
        }
        
        // Input validation and sanitization
        validateTestimonialRequest(request);
        
        // Sanitize inputs to prevent SQL injection and XSS
        request.setName(sanitizeInput(request.getName()));
        request.setTitle(sanitizeInput(request.getTitle()));
        request.setCompany(sanitizeInput(request.getCompany()));
        request.setMessage(sanitizeInput(request.getMessage()));
        
        Testimonial testimonial = requestMapper.toEntity(request);
        Testimonial saved = testimonialRepository.save(testimonial);
        
        // Increment daily counter
        dailyCountService.incrementDailyCount();
        
        return responseMapper.toModel(saved);
    }

    private void validateTestimonialRequest(TestimonialRequestModel request) {
        if (request.getName() == null || request.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Name is required");
        }
        if (request.getName().length() > TestimonialRequestModel.MAX_NAME_LENGTH) {
            throw new IllegalArgumentException("Name must not exceed " + TestimonialRequestModel.MAX_NAME_LENGTH + " characters");
        }
        
        if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
            throw new IllegalArgumentException("Title is required");
        }
        if (request.getTitle().length() > TestimonialRequestModel.MAX_TITLE_LENGTH) {
            throw new IllegalArgumentException("Title must not exceed " + TestimonialRequestModel.MAX_TITLE_LENGTH + " characters");
        }
        
        if (request.getCompany() != null && request.getCompany().length() > TestimonialRequestModel.MAX_COMPANY_LENGTH) {
            throw new IllegalArgumentException("Company must not exceed " + TestimonialRequestModel.MAX_COMPANY_LENGTH + " characters");
        }
        
        if (request.getMessage() == null || request.getMessage().trim().isEmpty()) {
            throw new IllegalArgumentException("Message is required");
        }
        
        int charCount = request.getMessage().length();
        if (charCount > TestimonialRequestModel.MAX_MESSAGE_CHARACTERS) {
            throw new IllegalArgumentException("Message must not exceed " + TestimonialRequestModel.MAX_MESSAGE_CHARACTERS + " characters (currently " + charCount + " characters)");
        }
        
        if (request.getRating() == null || request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5");
        }
    }

    private String sanitizeInput(String input) {
        if (input == null) {
            return null;
        }
        // Remove SQL injection attempts: --, ;, *, /, xp_, sp_
        input = input.replaceAll("(--|;|\\*|/|xp_|sp_)", "");
        // Trim whitespace
        input = input.trim();
        return input;
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
    public void updateTestimonial(String testimonialId, TestimonialRequestModel request) {
        Testimonial testimonial = testimonialRepository.findById(testimonialId)
            .orElseThrow(() -> new RuntimeException("Testimonial not found"));
        
        // Update only the isFeatured field if present in the request
        if (request.getIsFeatured() != null) {
            testimonial.setIsFeatured(request.getIsFeatured());
        }
        
        testimonialRepository.save(testimonial);
    }

    @Override
    public void deleteTestimonial(String testimonialId) {
        testimonialRepository.deleteById(testimonialId);
    }
}
