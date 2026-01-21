package com.oliviergingras.portfolio.workexperiencesubdomain.businessLayer;


import com.oliviergingras.portfolio.common.NotFoundException;
import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperience;
import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperienceIdentifier;
import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperienceRepository;
import com.oliviergingras.portfolio.workexperiencesubdomain.mappingLayer.WorkExperienceRequestMapper;
import com.oliviergingras.portfolio.workexperiencesubdomain.mappingLayer.WorkExperienceResponseMapper;
import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceRequestModel;
import com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer.WorkExperienceResponseModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class WorkExperienceServiceImpl implements WorkExperienceService {

    private final WorkExperienceRepository workExperienceRepository;
    private final WorkExperienceResponseMapper workExperienceResponseMapper;

    public WorkExperienceServiceImpl(WorkExperienceRepository workExperienceRepository,
                                    WorkExperienceRequestMapper workExperienceRequestMapper,
                                    WorkExperienceResponseMapper workExperienceResponseMapper) {
        this.workExperienceRepository = workExperienceRepository;
        this.workExperienceResponseMapper = workExperienceResponseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkExperienceResponseModel> getAllWorkExperiences() {
        List<WorkExperience> workExperiences = workExperienceRepository.findAll();
        return workExperienceResponseMapper.toResponseModelList(workExperiences);
    }

    @Override
    @Transactional(readOnly = true)
    public WorkExperienceResponseModel getWorkExperienceById(String id) {
        WorkExperience workExperience = workExperienceRepository.findWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(id)
                .orElseThrow(() -> new NotFoundException("Work experience not found: " + id));

        return workExperienceResponseMapper.toResponseModel(workExperience);
    }

    @Override
    public WorkExperienceResponseModel createWorkExperience(WorkExperienceRequestModel request) {
        WorkExperience workExperience = new WorkExperience();

        // Explicit setters (all fields)
        workExperience.setWorkExperienceIdentifier(new WorkExperienceIdentifier());
        workExperience.setCompany(request.getCompany());
        workExperience.setPosition(request.getPosition());
        workExperience.setDescription(request.getDescription());
        workExperience.setStartDate(request.getStartDate());
        workExperience.setEndDate(request.getEndDate());
        workExperience.setIsCurrent(request.getIsCurrent());

        WorkExperience saved = workExperienceRepository.save(workExperience);
        return workExperienceResponseMapper.toResponseModel(saved);
    }

    @Override
    public WorkExperienceResponseModel updateWorkExperience(String id, WorkExperienceRequestModel request) {
        WorkExperience existing = workExperienceRepository.findWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(id)
                .orElseThrow(() -> new NotFoundException("Work experience not found: " + id));

        existing.setCompany(request.getCompany());
        existing.setPosition(request.getPosition());
        existing.setDescription(request.getDescription());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setIsCurrent(request.getIsCurrent());

        WorkExperience updated = workExperienceRepository.save(existing);
        return workExperienceResponseMapper.toResponseModel(updated);
    }


    @Override
    public void deleteWorkExperience(String id) {
        if (!workExperienceRepository.existsWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(id)) {
            throw new NotFoundException("Work experience not found: " + id);
        }
        workExperienceRepository.deleteWorkExperienceByWorkExperienceIdentifier_WorkExperienceId(id);
    }

}
