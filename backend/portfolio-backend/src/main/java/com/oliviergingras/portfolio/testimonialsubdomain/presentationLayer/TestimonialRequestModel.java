package com.oliviergingras.portfolio.testimonialsubdomain.presentationLayer;

public class TestimonialRequestModel {
    public String name;
    public String title;
    public String company;
    public String titleFr;
    public String companyFr;
    public Integer rating;
    public String message;
    public String messageFr;

    // Validation constants
    public static final int MAX_MESSAGE_CHARACTERS = 1000;
    public static final int MAX_NAME_LENGTH = 100;
    public static final int MAX_TITLE_LENGTH = 100;
    public static final int MAX_COMPANY_LENGTH = 100;

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
