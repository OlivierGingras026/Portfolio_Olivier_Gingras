package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

public class TestimonialResponseModel {
    public String testimonialId;
    public String name;
    public String title;
    public String company;
    public String titleFr;
    public String companyFr;
    public Integer rating;
    public String message;
    public String messageFr;
    public String status;
    public String createdAt;

    public TestimonialResponseModel() {}

    public TestimonialResponseModel(String testimonialId, String name, String title, String company, Integer rating, String message, String status, String createdAt) {
        this.testimonialId = testimonialId;
        this.name = name;
        this.title = title;
        this.company = company;
        this.rating = rating;
        this.message = message;
        this.status = status;
        this.createdAt = createdAt;
    }

    public String getTestimonialId() { return testimonialId; }
    public void setTestimonialId(String testimonialId) { this.testimonialId = testimonialId; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
}
