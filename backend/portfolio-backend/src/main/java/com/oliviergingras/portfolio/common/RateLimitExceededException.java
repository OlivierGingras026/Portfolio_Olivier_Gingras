package com.oliviergingras.portfolio.common;

public class RateLimitExceededException extends RuntimeException {
    private long retryAfterSeconds;

    public RateLimitExceededException(String message) {
        super(message);
        this.retryAfterSeconds = 0;
    }

    public RateLimitExceededException(String message, long retryAfterSeconds) {
        super(message);
        this.retryAfterSeconds = retryAfterSeconds;
    }

    public RateLimitExceededException(String message, Throwable cause) {
        super(message, cause);
        this.retryAfterSeconds = 0;
    }

    public long getRetryAfterSeconds() {
        return retryAfterSeconds;
    }
}
