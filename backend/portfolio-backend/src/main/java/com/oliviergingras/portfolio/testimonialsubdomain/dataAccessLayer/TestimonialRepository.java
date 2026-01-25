package com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface TestimonialRepository extends JpaRepository<Testimonial, String> {
    List<Testimonial> findByStatusOrderByCreatedAtDesc(Testimonial.TestimonialStatus status);
    List<Testimonial> findAllByOrderByCreatedAtDesc();
}
