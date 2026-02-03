package com.oliviergingras.portfolio.cvsubdomain.mapperLayer;

import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFile;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileResponseModel;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;

@Component
public class CVFileResponseMapper {
    public CVFileResponseModel toModel(CVFile entity) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");
        return new CVFileResponseModel(
            entity.getCvId(),
            entity.getFileName(),
            entity.getFileSize(),
            entity.getUploadedAt().format(formatter),
            entity.getIsActive(),
            entity.getIsFrench()
        );
    }
}
