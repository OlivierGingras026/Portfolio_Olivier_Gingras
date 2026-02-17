package com.oliviergingras.portfolio.cvsubdomain.businessLayer;

import com.oliviergingras.portfolio.cvsubdomain.CVNotFoundException;
import com.oliviergingras.portfolio.cvsubdomain.FrenchCVAlreadyExistsException;
import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFile;
import com.oliviergingras.portfolio.cvsubdomain.dataAccessLayer.CVFileRepository;
import com.oliviergingras.portfolio.cvsubdomain.mapperLayer.CVFileRequestMapper;
import com.oliviergingras.portfolio.cvsubdomain.mapperLayer.CVFileResponseMapper;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileRequestModel;
import com.oliviergingras.portfolio.cvsubdomain.presentationLayer.CVFileResponseModel;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

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
        // If uploading a French CV, mark any existing French CV as English
        if (request.getIsFrench()) {
            cvFileRepository.findFirstByIsFrench(true).ifPresent(cv -> {
                cv.setIsFrench(false);
                cvFileRepository.save(cv);
            });
        }
        
        // Deactivate previous CV for the specific language
        cvFileRepository.findFirstByIsActiveAndIsFrenchOrderByUploadedAtDesc(true, request.getIsFrench()).ifPresent(cv -> {
            cv.setIsActive(false);
            cvFileRepository.save(cv);
        });

        // Save new CV
        CVFile newCV = requestMapper.toEntity(request);
        CVFile saved = cvFileRepository.save(newCV);
        return responseMapper.toModel(saved);
    }

    @Override
    public CVFileResponseModel getActiveCV(Boolean isFrench) {
        return cvFileRepository.findFirstByIsActiveAndIsFrenchOrderByUploadedAtDesc(true, isFrench)
            .map(responseMapper::toModel)
            .orElseThrow(() -> new CVNotFoundException("No active CV found for language: " + (isFrench ? "French" : "English")));
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

    @Override
    public void deleteCV(String cvId) {
        if (!cvFileRepository.existsById(cvId)) {
            throw new RuntimeException("CV file not found");
        }
        cvFileRepository.deleteById(cvId);
    }

    @Override
    public List<CVFileResponseModel> getAllCVs() {
        return cvFileRepository.findAll().stream()
            .map(responseMapper::toModel)
            .collect(Collectors.toList());
    }

    @Override
    public CVFileResponseModel activateCV(String cvId) {
        CVFile cv = cvFileRepository.findById(cvId)
            .orElseThrow(() -> new RuntimeException("CV file not found"));
        
        // Deactivate other CVs of the same language
        cvFileRepository.findFirstByIsActiveAndIsFrenchOrderByUploadedAtDesc(true, cv.getIsFrench()).ifPresent(otherCv -> {
            if (!otherCv.getCvId().equals(cvId)) {
                otherCv.setIsActive(false);
                cvFileRepository.save(otherCv);
            }
        });
        
        // Activate this CV
        cv.setIsActive(true);
        CVFile saved = cvFileRepository.save(cv);
        return responseMapper.toModel(saved);
    }

    @Override
    public CVFileResponseModel updateCVLanguage(String cvId, Boolean isFrench) {
        CVFile cv = cvFileRepository.findById(cvId)
            .orElseThrow(() -> new RuntimeException("CV file not found"));
        
        Boolean wasFrench = cv.getIsFrench();
        
        // If marking this CV as French, automatically mark the other CV as English
        if (isFrench && !wasFrench) {
            cvFileRepository.findAll().stream()
                .filter(otherCv -> !otherCv.getCvId().equals(cvId) && otherCv.getIsFrench())
                .findFirst()
                .ifPresent(otherCv -> {
                    otherCv.setIsFrench(false);
                    cvFileRepository.save(otherCv);
                });
        }
        // If unmarking this CV as French, automatically mark the other CV as French
        else if (!isFrench && wasFrench) {
            cvFileRepository.findAll().stream()
                .filter(otherCv -> !otherCv.getCvId().equals(cvId) && !otherCv.getIsFrench())
                .findFirst()
                .ifPresent(otherCv -> {
                    otherCv.setIsFrench(true);
                    cvFileRepository.save(otherCv);
                });
        }
        
        cv.setIsFrench(isFrench);
        CVFile saved = cvFileRepository.save(cv);
        return responseMapper.toModel(saved);
    }

    @Override
    public CVFileResponseModel updateCVFile(String cvId, byte[] fileData, String fileName, long fileSize, Boolean isFrench) {
        CVFile cv = cvFileRepository.findById(cvId)
            .orElseThrow(() -> new RuntimeException("CV file not found"));
        
        Boolean wasFrench = cv.getIsFrench();
        
        cv.setFileData(fileData);
        cv.setFileName(fileName);
        cv.setFileSize(fileSize);
        cv.setIsFrench(isFrench);
        CVFile saved = cvFileRepository.save(cv);
        
        // If marking this CV as French, automatically mark the other CV as English
        if (isFrench && !wasFrench) {
            cvFileRepository.findAll().stream()
                .filter(otherCv -> !otherCv.getCvId().equals(cvId) && otherCv.getIsFrench())
                .findFirst()
                .ifPresent(otherCv -> {
                    otherCv.setIsFrench(false);
                    cvFileRepository.save(otherCv);
                });
        }
        // If unmarking this CV as French, automatically mark the other CV as French
        else if (!isFrench && wasFrench) {
            cvFileRepository.findAll().stream()
                .filter(otherCv -> !otherCv.getCvId().equals(cvId) && !otherCv.getIsFrench())
                .findFirst()
                .ifPresent(otherCv -> {
                    otherCv.setIsFrench(true);
                    cvFileRepository.save(otherCv);
                });
        }
        
        return responseMapper.toModel(saved);
    }
}
