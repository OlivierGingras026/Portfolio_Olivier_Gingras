package com.oliviergingras.portfolio.common;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service to handle IP-based rate limiting using in-memory cache
 */
@Service
public class RateLimitService {

    private static final int MAX_REQUESTS = 5;
    private static final long TIME_WINDOW_MINUTES = 20;
    
    // Key: IP address, Value: list of request timestamps
    private final ConcurrentHashMap<String, List<LocalDateTime>> requestTracker = new ConcurrentHashMap<>();

    /**
     * Checks if an IP address has exceeded the rate limit
     * 
     * @param ipAddress the client IP address
     * @return true if rate limit is exceeded, false otherwise
     */
    public boolean isRateLimitExceeded(String ipAddress) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(TIME_WINDOW_MINUTES);
        
        // Get or create request list for this IP
        List<LocalDateTime> requests = requestTracker.computeIfAbsent(ipAddress, k -> new ArrayList<>());
        
        // Remove requests outside the time window
        requests.removeIf(timestamp -> timestamp.isBefore(windowStart));
        
        return requests.size() >= MAX_REQUESTS;
    }

    /**
     * Records a request from an IP address
     * 
     * @param ipAddress the client IP address
     */
    public void recordRequest(String ipAddress) {
        LocalDateTime now = LocalDateTime.now();
        List<LocalDateTime> requests = requestTracker.computeIfAbsent(ipAddress, k -> new ArrayList<>());
        requests.add(now);
    }

    /**
     * Gets the retry-after time in seconds for an IP that exceeded the rate limit
     * 
     * @param ipAddress the client IP address
     * @return seconds to wait before retry
     */
    public long getRetryAfterSeconds(String ipAddress) {
        LocalDateTime now = LocalDateTime.now();
        LocalDateTime windowStart = now.minusMinutes(TIME_WINDOW_MINUTES);
        
        List<LocalDateTime> requests = requestTracker.getOrDefault(ipAddress, new ArrayList<>());
        
        // Find oldest request in the window
        LocalDateTime oldestRequest = requests.stream()
            .filter(timestamp -> timestamp.isAfter(windowStart))
            .min(LocalDateTime::compareTo)
            .orElse(now);
        
        LocalDateTime retryAt = oldestRequest.plusMinutes(TIME_WINDOW_MINUTES);
        long retryAfterSeconds = java.time.temporal.ChronoUnit.SECONDS.between(now, retryAt);
        
        return Math.max(1, retryAfterSeconds);
    }

    /**
     * Cleans up old IP entries from the tracker to prevent memory bloat
     * Runs every hour
     */
    @Scheduled(fixedDelay = 3600000) // 1 hour in milliseconds
    public void cleanupOldEntries() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(1);
        
        requestTracker.forEach((ip, requests) -> {
            requests.removeIf(timestamp -> timestamp.isBefore(cutoff));
        });
        
        // Remove IPs with no requests
        requestTracker.entrySet().removeIf(entry -> entry.getValue().isEmpty());
    }
}
