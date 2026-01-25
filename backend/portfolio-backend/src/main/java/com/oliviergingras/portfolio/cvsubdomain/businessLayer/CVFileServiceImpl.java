package com.oliviergingras.portfolio.cvsubdomain.businessLayer;

import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFile;
import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFileRepository;
import com.oliviergingras.portfolio.cvsubdomain.mapperLayer.CVFileRequestMapper;
import com.oliviergingras.portfolio.cvsubdomain.mapperLayer.CVFileResponseMapper;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileRequestModel;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileResponseModel;
import org.springframework.stereotype.Service;

@Service
public class CVFileServiceImpl implements CVFileService {
    private final CVFileRepository cvFileRepository;
    private final CVFileRequestMapper requestMapper;
    private final CVFileResponseMapper responseMapper;

    public CVFileServiceImpl(CVFileRepository cvFileRepository, CVFileRequestMapper requestMapper, CVFileResponseMapper responseMapper) {
        this.cvFileRepository = cvFileRepository;
        this.requestMapper = requestMapper;
        this.responseMapper = responseMapper;
    }

    @Override
    public CVFileResponseModel uploadCV(CVFileRequestModel request) {
        // Deactivate previous CV
        cvFileRepository.findFirstByIsActiveOrderByUploadedAtDesc(true).ifPresent(cv -> {
            cv.setIsActive(false);
            cvFileRepository.save(cv);
        });

        // Save new CV
        CVFile newCV = requestMapper.toEntity(request);
        CVFile saved = cvFileRepository.save(newCV);
        return responseMapper.toModel(saved);
    }

    @Override
    public CVFileResponseModel getActiveCV() {
        return cvFileRepository.findFirstByIsActiveOrderByUploadedAtDesc(true)
            .map(responseMapper::toModel)
            .orElseThrow(() -> new RuntimeException("No active CV found"));
    }

    @Override
    public byte[] downloadCV(String cvId) {
        return cvFileRepository.findById(cvId)
            .map(CVFile::getFileData)
            .orElseThrow(() -> new RuntimeException("CV file not found"));
    }

    @Override
    public void deactivateCV(String cvId) {
        CVFile cv = cvFileRepository.findById(cvId)
            .orElseThrow(() -> new RuntimeException("CV file not found"));
        cv.setIsActive(false);
        cvFileRepository.save(cv);
    }
}
