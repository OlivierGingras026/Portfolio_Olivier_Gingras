package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

public class TestimonialRequestModel {
    public String name;
    public String title;
    public String company;
    public Integer rating;
    public String message;

    public TestimonialRequestModel() {}

    public TestimonialRequestModel(String name, String title, String company, Integer rating, String message) {
        this.name = name;
        this.title = title;
        this.company = company;
        this.rating = rating;
        this.message = message;
    }

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
}
