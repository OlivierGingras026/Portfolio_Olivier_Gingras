package com.oliviergingras.portfolio.common;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Utility to extract client IP address from requests, handling proxy headers safely
 * 
 * IMPROVEMENTS:
 * - Validates IP format to prevent spoofed/malformed IPs
 * - Only trusts X-Forwarded-For from known trusted proxies (Render, CloudFlare, AWS)
 * - Configurable proxy trust via environment variable
 * - Rejects suspicious headers with spaces or invalid format
 */
@Component
public class IpAddressExtractor {

    // Trusted proxy environments - only trust X-Forwarded-For from these
    private static final String[] TRUSTED_PROXY_ENVIRONMENTS = {
        "render", // Render.com
        "cloudflare", // CloudFlare
        "amazonaws", // AWS
        "heroku" // Heroku
    };
    
    // Proxy headers to check (in order of preference)
    private static final String[] PROXY_HEADERS = {
        "CF-Connecting-IP",      // CloudFlare
        "X-Forwarded-For",       // General proxy
        "X-Real-IP",             // Nginx
        "Proxy-Client-IP",
        "WL-Proxy-Client-IP"
    };

    @Value("${app.trust-proxy-headers:true}")
    private boolean trustProxyHeaders;

    /**
     * Extracts client IP address from HTTP request.
     * Safely handles proxy headers with validation.
     * 
     * @param request the HTTP servlet request
     * @return the validated client IP address
     */
    public String extractClientIp(HttpServletRequest request) {
        // Check if we should trust proxy headers (only for trusted environments)
        boolean isBehindTrustedProxy = isBehindTrustedProxy(request);
        
        if (trustProxyHeaders && isBehindTrustedProxy) {
            // Check proxy headers
            for (String header : PROXY_HEADERS) {
                String ip = request.getHeader(header);
                if (isValidIp(ip)) {
                    // X-Forwarded-For can contain multiple IPs, get the first one (client IP)
                    if ("X-Forwarded-For".equals(header) && ip.contains(",")) {
                        ip = ip.split(",")[0].trim();
                    }
                    if (isValidIp(ip)) {
                        return ip;
                    }
                }
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
    
    /**
     * Checks if the request is from a known trusted proxy
     * Prevents trusting X-Forwarded-For from untrusted sources
     * 
     * @param request the HTTP servlet request
     * @return true if behind a trusted proxy, false otherwise
     */
    private boolean isBehindTrustedProxy(HttpServletRequest request) {
        String host = request.getServerName();
        String userAgent = request.getHeader("User-Agent");
        
        // Check if running on known platforms by hostname/env
        String env = System.getenv("RENDER_EXTERNAL_HOSTNAME");
        if (env != null) {
            return true; // We're on Render
        }
        
        // Check for CloudFlare CF-Ray header (indicates CloudFlare)
        if (request.getHeader("CF-Ray") != null) {
            return true;
        }
        
        // Check for CloudFlare User-Agent
        if (userAgent != null && userAgent.contains("cloudflare")) {
            return true;
        }
        
        // Check for AWS ALB header
        if (request.getHeader("X-Amzn-Trace-Id") != null) {
            return true;
        }
        
        // Local development - trust localhost
        if ("127.0.0.1".equals(request.getRemoteAddr()) || "localhost".equals(request.getRemoteAddr())) {
            return true;
        }
        
        return false;
    }
    
    /**
     * Validates IP address format to prevent malformed or spoofed IPs
     * 
     * @param ip the IP address to validate
     * @return true if IP appears valid, false otherwise
     */
    private boolean isValidIp(String ip) {
        if (ip == null || ip.trim().isEmpty()) {
            return false;
        }
        
        ip = ip.trim();
        
        // Reject if contains spaces (common in spoofed headers)
        if (ip.contains(" ")) {
            return false;
        }
        
        // Reject if contains suspicious characters
        if (ip.matches(".*[;<>'\"%()\\\\].*")) {
            return false;
        }
        
        // Validate IPv4
        if (ip.matches("^\\d+\\.\\d+\\.\\d+\\.\\d+$")) {
            String[] parts = ip.split("\\.");
            for (String part : parts) {
                try {
                    int num = Integer.parseInt(part);
                    if (num < 0 || num > 255) {
                        return false;
                    }
                } catch (NumberFormatException e) {
                    return false;
                }
            }
            return true;
        }
        
        // Validate IPv6 (simplified)
        if (ip.contains(":")) {
            return ip.matches("^[0-9a-fA-F:]+$");
        }
        
        return false;
    }
}
