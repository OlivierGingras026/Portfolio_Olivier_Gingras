package com.oliviergingras.portfolio.cvsubdomain.businessLayer;

import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileRequestModel;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileResponseModel;

public interface CVFileService {
    CVFileResponseModel uploadCV(CVFileRequestModel request);
    CVFileResponseModel getActiveCV();
    byte[] downloadCV(String cvId);
    void deactivateCV(String cvId);
}
