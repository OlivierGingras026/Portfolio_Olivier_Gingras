package com.oliviergingras.portfolio.testimonialsubdomain.mapperLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer.Testimonial;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialResponseModel;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class TestimonialResponseMapper {
    public TestimonialResponseModel toModel(Testimonial entity) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        TestimonialResponseModel model = new TestimonialResponseModel(
            entity.getTestimonialId(),
            entity.getName(),
            entity.getTitle(),
            entity.getCompany(),
            entity.getRating(),
            entity.getMessage(),
            entity.getStatus().toString(),
            entity.getCreatedAt().format(formatter)
        );
        model.titleFr = entity.getTitleFr();
        model.companyFr = entity.getCompanyFr();
        model.messageFr = entity.getMessageFr();
        return model;
    }
}
