package com.oliviergingras.portfolio.educationsubdomain.businessLayer;


import com.oliviergingras.portfolio.common.NotFoundException;
import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.Education;
import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.EducationIdentifier;
import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.EducationRepository;
import com.oliviergingras.portfolio.educationsubdomain.mappingLayer.EducationRequestMapper;
import com.oliviergingras.portfolio.educationsubdomain.mappingLayer.EducationResponseMapper;
import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationRequestModel;
import com.oliviergingras.portfolio.educationsubdomain.presentationLayer.EducationResponseModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class EducationServiceImpl implements EducationService {

    private final EducationRepository educationRepository;
    private final EducationResponseMapper educationResponseMapper;

    public EducationServiceImpl(EducationRepository educationRepository,
                               EducationRequestMapper educationRequestMapper,
                               EducationResponseMapper educationResponseMapper) {
        this.educationRepository = educationRepository;
        this.educationResponseMapper = educationResponseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<EducationResponseModel> getAllEducations() {
        List<Education> educations = educationRepository.findAll();
        return educationResponseMapper.toResponseModelList(educations);
    }

    @Override
    @Transactional(readOnly = true)
    public EducationResponseModel getEducationById(String id) {
        Education education = educationRepository.findEducationByEducationIdentifier_EducationId(id)
                .orElseThrow(() -> new NotFoundException("Education not found: " + id));

        return educationResponseMapper.toResponseModel(education);
    }

    @Override
    public EducationResponseModel createEducation(EducationRequestModel request) {
        Education education = new Education();

        // Explicit setters (all fields)
        education.setEducationIdentifier(new EducationIdentifier());
        education.setSchool(request.getSchool());
        education.setDegree(request.getDegree());
        education.setDescription(request.getDescription());
        education.setSchoolFr(request.getSchoolFr());
        education.setDegreeFr(request.getDegreeFr());
        education.setDescriptionFr(request.getDescriptionFr());
        education.setStartDate(request.getStartDate());
        education.setEndDate(request.getEndDate());
        education.setIsCurrentlyStudying(request.getIsCurrentlyStudying());

        Education saved = educationRepository.save(education);
        return educationResponseMapper.toResponseModel(saved);
    }

    @Override
    public EducationResponseModel updateEducation(String id, EducationRequestModel request) {
        Education existing = educationRepository.findEducationByEducationIdentifier_EducationId(id)
                .orElseThrow(() -> new NotFoundException("Education not found: " + id));

        existing.setSchool(request.getSchool());
        existing.setDegree(request.getDegree());
        existing.setDescription(request.getDescription());
        existing.setSchoolFr(request.getSchoolFr());
        existing.setDegreeFr(request.getDegreeFr());
        existing.setDescriptionFr(request.getDescriptionFr());
        existing.setStartDate(request.getStartDate());
        existing.setEndDate(request.getEndDate());
        existing.setIsCurrentlyStudying(request.getIsCurrentlyStudying());

        Education updated = educationRepository.save(existing);
        return educationResponseMapper.toResponseModel(updated);
    }


    @Override
    public void deleteEducation(String id) {
        if (!educationRepository.existsEducationByEducationIdentifier_EducationId(id)) {
            throw new NotFoundException("Education not found: " + id);
        }
        educationRepository.deleteEducationByEducationIdentifier_EducationId(id);
    }

}
