package com.oliviergingras.portfolio.cvsubdomain.businessLayer;

import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileRequestModel;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileResponseModel;
import java.util.List;

public interface CVFileService {
    CVFileResponseModel uploadCV(CVFileRequestModel request);
    CVFileResponseModel getActiveCV(Boolean isFrench);
    byte[] downloadCV(String cvId);
    void deactivateCV(String cvId);
    void deleteCV(String cvId);
    List<CVFileResponseModel> getAllCVs();
    CVFileResponseModel activateCV(String cvId);
    CVFileResponseModel updateCVLanguage(String cvId, Boolean isFrench);
    CVFileResponseModel updateCVFile(String cvId, byte[] fileData, String fileName, long fileSize, Boolean isFrench);
}
