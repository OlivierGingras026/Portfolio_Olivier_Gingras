package com.oliviergingras.portfolio.cvsubdomain.mapperLayer;

import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFile;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileRequestModel;
import org.springframework.stereotype.Component;

@Component
public class CVFileRequestMapper {
    public CVFile toEntity(CVFileRequestModel model) {
        return new CVFile(model.getFileName(), model.getFileData(), model.getFileSize());
    }
}
