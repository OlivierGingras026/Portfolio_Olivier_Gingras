package com.oliviergingras.portfolio.contactsubdomain.presentationLayer;

public class RateLimitResponseModel {
    private int currentCount;
    private int maxLimit;
    private long secondsUntilReset;
    private boolean isLimited;

    public RateLimitResponseModel(int currentCount, int maxLimit, long secondsUntilReset, boolean isLimited) {
        this.currentCount = currentCount;
        this.maxLimit = maxLimit;
        this.secondsUntilReset = secondsUntilReset;
        this.isLimited = isLimited;
    }

    public int getCurrentCount() {
        return currentCount;
    }

    public void setCurrentCount(int currentCount) {
        this.currentCount = currentCount;
    }

    public int getMaxLimit() {
        return maxLimit;
    }

    public void setMaxLimit(int maxLimit) {
        this.maxLimit = maxLimit;
    }

    public long getSecondsUntilReset() {
        return secondsUntilReset;
    }

    public void setSecondsUntilReset(long secondsUntilReset) {
        this.secondsUntilReset = secondsUntilReset;
    }

    public boolean isLimited() {
        return isLimited;
    }

    public void setLimited(boolean limited) {
        isLimited = limited;
    }
}
