package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

public class CVFileRequestModel {
    public String fileName;
    public byte[] fileData;
    public Long fileSize;

    public CVFileRequestModel() {}

    public CVFileRequestModel(String fileName, byte[] fileData, Long fileSize) {
        this.fileName = fileName;
        this.fileData = fileData;
        this.fileSize = fileSize;
    }

    public String getFileName() { return fileName; }
    public void setFileName(String fileName) { this.fileName = fileName; }

    public byte[] getFileData() { return fileData; }
    public void setFileData(byte[] fileData) { this.fileData = fileData; }

    public Long getFileSize() { return fileSize; }
    public void setFileSize(Long fileSize) { this.fileSize = fileSize; }
}
