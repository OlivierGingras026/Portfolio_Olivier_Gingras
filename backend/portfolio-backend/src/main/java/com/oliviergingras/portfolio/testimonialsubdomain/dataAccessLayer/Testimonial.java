package com.oliviergingras.portfolio.testimonialsubdomain.dataAccessLayer;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Entity
@Table(name = "testimonials")
@Data
@NoArgsConstructor
public class Testimonial {
    public enum TestimonialStatus {
        PENDING, APPROVED, REJECTED
    }

    @Id
    @Column(name = "testimonial_id")
    private String testimonialId;

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "company", nullable = true)
    private String company;

    @Column(name = "title_fr")
    private String titleFr;

    @Column(name = "company_fr")
    private String companyFr;

    @Column(name = "rating")
    private Integer rating;

    @Column(name = "message", nullable = false, columnDefinition = "TEXT")
    private String message;

    @Column(name = "message_fr", columnDefinition = "TEXT")
    private String messageFr;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private TestimonialStatus status;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    public Testimonial(String name, String title, String company, Integer rating, String message) {
        this.testimonialId = java.util.UUID.randomUUID().toString();
        this.name = name;
        this.title = title;
        this.company = company;
        this.rating = rating;
        this.message = message;
        this.status = TestimonialStatus.PENDING;
        this.createdAt = LocalDateTime.now();
    }
}
