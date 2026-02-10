package com.oliviergingras.portfolio.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;

/**
 * Configuration for scheduling
 */
@Configuration
@EnableScheduling
public class CacheConfig {
    // EnableScheduling is required for @Scheduled annotations in RateLimitService
}
