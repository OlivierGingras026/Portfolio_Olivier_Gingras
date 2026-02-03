package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

public class CVFileRequestModel {
    public String fileName;
    public byte[] fileData;
    public Long fileSize;
    public Boolean isFrench;

    public CVFileRequestModel() {}

    public CVFileRequestModel(String fileName, byte[] fileData, Long fileSize, Boolean isFrench) {
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileSize = fileSize;
        this.isFrench = isFrench;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }

    public Boolean getIsFrench() { return isFrench; }
    public void setIsFrench(Boolean isFrench) { this.isFrench = isFrench; }
}
