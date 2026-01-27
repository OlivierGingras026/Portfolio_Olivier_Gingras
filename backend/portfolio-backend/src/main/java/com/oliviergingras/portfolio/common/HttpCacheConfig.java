package com.oliviergingras.portfolio.common;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.HandlerInterceptor;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * HTTP Caching Configuration for improved performance
 * 
 * Caching Strategy:
 * - Public endpoints: Cache for 1 hour (3600 seconds)
 * - Admin endpoints: No cache (must always be fresh)
 */
@Configuration
public class HttpCacheConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new CacheHeaderInterceptor());
    }

    public static class CacheHeaderInterceptor implements HandlerInterceptor {

        @Override
        public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) {
            String path = request.getRequestURI();

            // Cache public API endpoints for 1 hour (3600 seconds)
            if (path.contains("/api/public/") || path.contains("/api/v1/")) {
                // Cache for 1 hour: public, immutable (for GET requests)
                response.setHeader("Cache-Control", "public, max-age=3600, immutable");
                response.setHeader("Expires", String.valueOf(System.currentTimeMillis() + 3600000));
            }
            // Admin endpoints should not be cached
            else if (path.contains("/api/admin/")) {
                response.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
                response.setHeader("Pragma", "no-cache");
                response.setHeader("Expires", "0");
            }

            return true;
        }
    }
}
