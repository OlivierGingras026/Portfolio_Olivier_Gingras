package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

public class CVFileResponseModel {
    public String cvId;
    public String fileName;
    public Long fileSize;
    public String uploadedAt;
    public Boolean isActive;
    public Boolean isFrench;

    public CVFileResponseModel() {}

    public CVFileResponseModel(String cvId, String fileName, Long fileSize, String uploadedAt, Boolean isActive, Boolean isFrench) {
        this.cvId = cvId;
        this.fileName = fileName;
        this.fileSize = fileSize;
        this.uploadedAt = uploadedAt;
        this.isActive = isActive;
        this.isFrench = isFrench;
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

    public Boolean getIsFrench() { return isFrench; }
    public void setIsFrench(Boolean isFrench) { this.isFrench = isFrench; }
}
