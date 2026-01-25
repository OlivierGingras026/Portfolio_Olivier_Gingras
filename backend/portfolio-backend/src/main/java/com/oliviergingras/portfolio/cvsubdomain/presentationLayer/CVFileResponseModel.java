package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

public class CVFileResponseModel {
    public String cvId;
    public String fileName;
    public Long fileSize;
    public String uploadedAt;
    public Boolean isActive;

    public CVFileResponseModel() {}

    public CVFileResponseModel(String cvId, String fileName, Long fileSize, String uploadedAt, Boolean isActive) {
        this.cvId = cvId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
        this.isActive = isActive;
    }

    public String getCvId() { return cvId; }
    public void setCvId(String cvId) { this.cvId = cvId; }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public String getUploadedAt() { return uploadedAt; }
    public void setUploadedAt(String uploadedAt) { this.uploadedAt = uploadedAt; }

    public Boolean getIsActive() { return isActive; }
    public void setIsActive(Boolean isActive) { this.isActive = isActive; }
}
