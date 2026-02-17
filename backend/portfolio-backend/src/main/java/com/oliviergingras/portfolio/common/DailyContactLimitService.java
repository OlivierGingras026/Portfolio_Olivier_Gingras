package com.oliviergingras.portfolio.common;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;

/**
 * Service to track daily contact message submissions
 * Limits contact messages to a max of 20 per day
 */
@Service
public class DailyContactLimitService {
    
    private static final int MAX_MESSAGES_PER_DAY = 20;
    
    // Key: LocalDate as string, Value: count of messages for that day
    private final ConcurrentHashMap<String, AtomicInteger> dailyCount = new ConcurrentHashMap<>();
    
    /**
     * Checks if the daily limit has been exceeded
     * 
     * @return true if limit is exceeded, false otherwise
     */
    public boolean isDailyLimitExceeded() {
        String today = LocalDate.now().toString();
        AtomicInteger count = dailyCount.getOrDefault(today, new AtomicInteger(0));
        return count.get() >= MAX_MESSAGES_PER_DAY;
    }
    
    /**
     * Gets the current count of messages for today
     * 
     * @return the count
     */
    public int getTodayCount() {
        String today = LocalDate.now().toString();
        return dailyCount.getOrDefault(today, new AtomicInteger(0)).get();
    }
    
    /**
     * Increments the daily counter
     */
    public void incrementDailyCount() {
        String today = LocalDate.now().toString();
        dailyCount.computeIfAbsent(today, k -> new AtomicInteger(0)).incrementAndGet();
    }
    
    /**
     * Resets counters older than today (scheduled daily at midnight)
     */
    @Scheduled(cron = "0 0 0 * * *")  // Run at midnight every day
    public void cleanupOldCounters() {
        String today = LocalDate.now().toString();
        
        // Remove all entries that are not today
        dailyCount.keySet().removeIf(date -> !date.equals(today));
    }
}
