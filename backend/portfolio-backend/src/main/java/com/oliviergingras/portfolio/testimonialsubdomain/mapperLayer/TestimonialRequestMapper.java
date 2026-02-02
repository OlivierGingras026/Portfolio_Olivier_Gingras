package com.oliviergingras.portfolio.testimonialsubdomain.mapperLayer;

import com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer.Testimonial;
import com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer.TestimonialRequestModel;
import org.springframework.stereotype.Component;

@Component
public class TestimonialRequestMapper {
    public Testimonial toEntity(TestimonialRequestModel model) {
        Testimonial testimonial = new Testimonial(model.getName(), model.getTitle(), model.getCompany(), model.getRating(), model.getMessage());
        testimonial.setTitleFr(model.titleFr);
        testimonial.setCompanyFr(model.companyFr);
        testimonial.setMessageFr(model.messageFr);
        return testimonial;
    }
}
