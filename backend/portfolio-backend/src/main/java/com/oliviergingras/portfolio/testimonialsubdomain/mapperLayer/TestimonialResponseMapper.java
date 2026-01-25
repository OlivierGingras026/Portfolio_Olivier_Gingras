package com.oliviergingras.portfolio.testimonialsubdomain.mapperLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer.Testimonial;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialResponseModel;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class TestimonialResponseMapper {
    public TestimonialResponseModel toModel(Testimonial entity) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new TestimonialResponseModel(
            entity.getTestimonialId(),
            entity.getName(),
            entity.getTitle(),
            entity.getCompany(),
            entity.getRating(),
            entity.getMessage(),
            entity.getStatus().toString(),
            entity.getCreatedAt().format(formatter)
        );
    }
}
