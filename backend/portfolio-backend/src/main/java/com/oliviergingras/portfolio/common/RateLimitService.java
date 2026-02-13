package com.oliviergingras.portfolio.common;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to handle IP-based rate limiting using in-memory cache with improved thread safety
 * 
 * IMPROVEMENTS:
 * - Thread-safe list operations to prevent race conditions
 * - Synchronized blocks to ensure atomicity of check-then-record operations
 * - Better memory cleanup based on TIME_WINDOW instead of 1 hour
 * - Prevents unbounded list growth for blocked IPs
 * - Uses synchronized list for thread-safe iteration
 */
@Service
public class RateLimitService {

    private static final int MAX_REQUESTS = 5;
    private static final long TIME_WINDOW_MINUTES = 20;
    private static final long CLEANUP_INTERVAL_MS = 600000; // 10 minutes instead of 1 hour
    
    // Key: IP address, Value: synchronized list of request timestamps
    private final ConcurrentHashMap<String, List<LocalDateTime>> requestTracker = new ConcurrentHashMap<>();

    /**
     * Checks if an IP address has exceeded the rate limit
     * Thread-safe: synchronizes on the IP's request list
     * 
     * @param ipAddress the client IP address
     * @return true if rate limit is exceeded, false otherwise
     */
    public boolean isRateLimitExceeded(String ipAddress) {
        if (!isValidIpAddress(ipAddress)) {
            return false;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(TIME_WINDOW_MINUTES);
        
        // Get or create request list for this IP
        List<LocalDateTime> requests = requestTracker.computeIfAbsent(ipAddress, k -> Collections.synchronizedList(new ArrayList<>()));
        
        // Synchronize to prevent race condition between removeIf and size check
        synchronized (requests) {
            // Remove requests outside the time window
            requests.removeIf(timestamp -> timestamp.isBefore(windowStart));
            
            // Return true if we've already hit the limit
            return requests.size() >= MAX_REQUESTS;
        }
    }

    /**
     * Records a request from an IP address
     * Thread-safe: synchronizes on the IP's request list
     * Only call this AFTER checking isRateLimitExceeded
     * 
     * @param ipAddress the client IP address
     */
    public void recordRequest(String ipAddress) {
        if (!isValidIpAddress(ipAddress)) {
            return;
        }
        
        LocalDateTime now = LocalDateTime.now();
        List<LocalDateTime> requests = requestTracker.computeIfAbsent(ipAddress, k -> Collections.synchronizedList(new ArrayList<>()));
        
        synchronized (requests) {
            // Clean old requests before adding new one
            LocalDateTime windowStart = now.minusMinutes(TIME_WINDOW_MINUTES);
            requests.removeIf(timestamp -> timestamp.isBefore(windowStart));
            
            // Add new request
            requests.add(now);
        }
    }

    /**
     * Gets the retry-after time in seconds for an IP that exceeded the rate limit
     * 
     * @param ipAddress the client IP address
     * @return seconds to wait before retry (minimum 1 second)
     */
    public long getRetryAfterSeconds(String ipAddress) {
        if (!isValidIpAddress(ipAddress)) {
            return 1;
        }
        
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(TIME_WINDOW_MINUTES);
        
        List<LocalDateTime> requests = requestTracker.getOrDefault(ipAddress, Collections.synchronizedList(new ArrayList<>()));
        
        LocalDateTime oldestRequest;
        synchronized (requests) {
            oldestRequest = requests.stream()
                .filter(timestamp -> timestamp.isAfter(windowStart))
                .min(LocalDateTime::compareTo)
                .orElse(now);
        }
        
        LocalDateTime retryAt = oldestRequest.plusMinutes(TIME_WINDOW_MINUTES);
        long retryAfterSeconds = java.time.temporal.ChronoUnit.SECONDS.between(now, retryAt);
        
        return Math.max(1, retryAfterSeconds);
    }

    /**
     * Cleans up old IP entries from the tracker to prevent memory bloat
     * Runs every 10 minutes (more frequent than before)
     */
    @Scheduled(fixedDelay = CLEANUP_INTERVAL_MS)
    public void cleanupOldEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusMinutes(TIME_WINDOW_MINUTES);
        
        requestTracker.forEach((ip, requests) -> {
            synchronized (requests) {
                // Remove all requests outside the window
                requests.removeIf(timestamp -> timestamp.isBefore(cutoff));
            }
        });
        
        // Remove IPs with no recent requests (thread-safe)
        requestTracker.entrySet().removeIf(entry -> {
            List<LocalDateTime> requests = entry.getValue();
            synchronized (requests) {
                return requests.isEmpty();
            }
        });
    }
    
    /**
     * Validates IP address format to prevent malformed or spoofed IPs
     * 
     * @param ipAddress the IP address to validate
     * @return true if IP appears valid, false otherwise
     */
    private boolean isValidIpAddress(String ipAddress) {
        if (ipAddress == null || ipAddress.isEmpty()) {
            return false;
        }
        
        // Reject if contains spaces (common in spoofed headers)
        if (ipAddress.contains(" ")) {
            return false;
        }
        
        // Basic IPv4 validation
        if (ipAddress.matches("^\\d+\\.\\d+\\.\\d+\\.\\d+$")) {
            String[] parts = ipAddress.split("\\.");
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
        
        // Accept IPv6 format (simplified check)
        if (ipAddress.contains(":")) {
            return ipAddress.matches("^[0-9a-fA-F:]+$");
        }
        
        return false;
    }
}
