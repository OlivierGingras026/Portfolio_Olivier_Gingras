package com.oliviergingras.portfolio.common;

import org.springframework.stereotype.Service;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.concurrent.atomic.AtomicLong;

/**
 * Rate limiting service with 12-hour rolling windows
 * Contact: max 20 requests per 12 hours, 1-hour ban on limit
 * Testimonial: max 100 requests per 12 hours, 1-hour ban on limit
 */
@Service
public class RateLimitService {
    
    // Contact limits
    private static final int MAX_CONTACT_REQUESTS = 20;
    private static final long CONTACT_WINDOW_SECONDS = 12 * 60 * 60; // 12 hours
    private static final long CONTACT_BAN_SECONDS = 60 * 60; // 1 hour
    
    // Testimonial limits
    private static final int MAX_TESTIMONIAL_REQUESTS = 100;
    private static final long TESTIMONIAL_WINDOW_SECONDS = 12 * 60 * 60; // 12 hours
    private static final long TESTIMONIAL_BAN_SECONDS = 60 * 60; // 1 hour
    
    // Contact limit tracking
    private AtomicInteger contactCount = new AtomicInteger(0);
    private AtomicLong contactWindowStart = new AtomicLong(System.currentTimeMillis());
    private AtomicLong contactLimitHitTime = new AtomicLong(0);
    
    // Testimonial limit tracking
    private AtomicInteger testimonialCount = new AtomicInteger(0);
    private AtomicLong testimonialWindowStart = new AtomicLong(System.currentTimeMillis());
    private AtomicLong testimonialLimitHitTime = new AtomicLong(0);
    
    // ==================== CONTACT METHODS ====================
    
    public void incrementContactCount() {
        checkAndResetContactWindow();
        int newCount = contactCount.incrementAndGet();
        
        // Record when limit is hit
        if (newCount == MAX_CONTACT_REQUESTS) {
            contactLimitHitTime.set(System.currentTimeMillis());
        }
    }
    
    public boolean isContactLimited() {
        checkAndResetContactWindow();
        
        if (contactCount.get() < MAX_CONTACT_REQUESTS) {
            return false;
        }
        
        // Limit is hit, check if ban period has expired
        long limitHitTime = contactLimitHitTime.get();
        if (limitHitTime == 0) {
            // Just hit limit
            contactLimitHitTime.set(System.currentTimeMillis());
            limitHitTime = contactLimitHitTime.get();
        }
        
        long elapsedSinceHit = System.currentTimeMillis() - limitHitTime;
        long banMs = CONTACT_BAN_SECONDS * 1000;
        
        if (elapsedSinceHit >= banMs) {
            // Ban expired, reset and allow
            contactCount.set(0);
            contactLimitHitTime.set(0);
            contactWindowStart.set(System.currentTimeMillis());
            return false;
        }
        
        return true;
    }
    
    public long getContactSecondsRemaining() {
        checkAndResetContactWindow();
        
        if (contactCount.get() < MAX_CONTACT_REQUESTS) {
            return 0;
        }
        
        long limitHitTime = contactLimitHitTime.get();
        if (limitHitTime == 0) {
            return 0;
        }
        
        long elapsedSinceHit = System.currentTimeMillis() - limitHitTime;
        long banMs = CONTACT_BAN_SECONDS * 1000;
        
        if (elapsedSinceHit >= banMs) {
            return 0;
        }
        
        return (banMs - elapsedSinceHit) / 1000;
    }
    
    public int getContactCount() {
        checkAndResetContactWindow();
        return contactCount.get();
    }
    
    private synchronized void checkAndResetContactWindow() {
        long now = System.currentTimeMillis();
        long windowStart = contactWindowStart.get();
        long windowMs = CONTACT_WINDOW_SECONDS * 1000;
        
        if (now - windowStart >= windowMs) {
            // Window expired, reset everything
            contactWindowStart.set(now);
            contactCount.set(0);
            contactLimitHitTime.set(0);
        }
    }
    
    // ==================== TESTIMONIAL METHODS ====================
    
    public void incrementTestimonialCount() {
        checkAndResetTestimonialWindow();
        int newCount = testimonialCount.incrementAndGet();
        
        // Record when limit is hit
        if (newCount == MAX_TESTIMONIAL_REQUESTS) {
            testimonialLimitHitTime.set(System.currentTimeMillis());
        }
    }
    
    public boolean isTestimonialLimited() {
        checkAndResetTestimonialWindow();
        
        if (testimonialCount.get() < MAX_TESTIMONIAL_REQUESTS) {
            return false;
        }
        
        // Limit is hit, check if ban period has expired
        long limitHitTime = testimonialLimitHitTime.get();
        if (limitHitTime == 0) {
            // Just hit limit
            testimonialLimitHitTime.set(System.currentTimeMillis());
            limitHitTime = testimonialLimitHitTime.get();
        }
        
        long elapsedSinceHit = System.currentTimeMillis() - limitHitTime;
        long banMs = TESTIMONIAL_BAN_SECONDS * 1000;
        
        if (elapsedSinceHit >= banMs) {
            // Ban expired, reset and allow
            testimonialCount.set(0);
            testimonialLimitHitTime.set(0);
            testimonialWindowStart.set(System.currentTimeMillis());
            return false;
        }
        
        return true;
    }
    
    public long getTestimonialSecondsRemaining() {
        checkAndResetTestimonialWindow();
        
        if (testimonialCount.get() < MAX_TESTIMONIAL_REQUESTS) {
            return 0;
        }
        
        long limitHitTime = testimonialLimitHitTime.get();
        if (limitHitTime == 0) {
            return 0;
        }
        
        long elapsedSinceHit = System.currentTimeMillis() - limitHitTime;
        long banMs = TESTIMONIAL_BAN_SECONDS * 1000;
        
        if (elapsedSinceHit >= banMs) {
            return 0;
        }
        
        return (banMs - elapsedSinceHit) / 1000;
    }
    
    public int getTestimonialCount() {
        checkAndResetTestimonialWindow();
        return testimonialCount.get();
    }
    
    private synchronized void checkAndResetTestimonialWindow() {
        long now = System.currentTimeMillis();
        long windowStart = testimonialWindowStart.get();
        long windowMs = TESTIMONIAL_WINDOW_SECONDS * 1000;
        
        if (now - windowStart >= windowMs) {
            // Window expired, reset everything
            testimonialWindowStart.set(now);
            testimonialCount.set(0);
            testimonialLimitHitTime.set(0);
        }
    }
}

