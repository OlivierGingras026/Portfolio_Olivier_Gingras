package com.oliviergingras.portfolio.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Component;

/**
 * Utility to extract client IP address from requests, handling proxy headers
 */
@Component
public class IpAddressExtractor {

    private static final String[] IP_HEADERS = {
        "X-Forwarded-For",
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP",
        "HTTP_X_FORWARDED_FOR",
        "HTTP_X_FORWARDED",
        "HTTP_X_FORWARDED_HOST",
        "HTTP_CF_CONNECTING_IP",
        "CF-Connecting-IP"
    };

    /**
     * Extracts client IP address from HTTP request.
     * Handles proxy headers like X-Forwarded-For (for Render, AWS load balancers, etc.)
     * 
     * @param request the HTTP servlet request
     * @return the client IP address
     */
    public String extractClientIp(HttpServletRequest request) {
        // Check proxy headers first (for Render, CloudFlare, AWS, etc.)
        for (String header : IP_HEADERS) {
            String ip = request.getHeader(header);
            if (ip != null && !ip.isEmpty() && !"unknown".equalsIgnoreCase(ip)) {
                // X-Forwarded-For can contain multiple IPs, get the first one
                return ip.split(",")[0].trim();
            }
        }
        
        // Fallback to direct remote address
        String ip = request.getRemoteAddr();
        
        // Handle IPv6 loopback
        if ("0:0:0:0:0:0:0:1".equals(ip)) {
            ip = "127.0.0.1";
        }
        
        return ip;
    }
}
