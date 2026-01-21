package com.oliviergingras.portfolio.hobbysubdomain.businessLayer;


import com.oliviergingras.portfolio.common.NotFoundException;
import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.Hobby;
import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.HobbyIdentifier;
import com.oliviergingras.portfolio.hobbysubdomain.dataAccessLayer.HobbyRepository;
import com.oliviergingras.portfolio.hobbysubdomain.mappingLayer.HobbyRequestMapper;
import com.oliviergingras.portfolio.hobbysubdomain.mappingLayer.HobbyResponseMapper;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyRequestModel;
import com.oliviergingras.portfolio.hobbysubdomain.presentationLayer.HobbyResponseModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class HobbyServiceImpl implements HobbyService {

    private final HobbyRepository hobbyRepository;
    private final HobbyResponseMapper hobbyResponseMapper;

    public HobbyServiceImpl(HobbyRepository hobbyRepository,
                           HobbyRequestMapper hobbyRequestMapper,
                           HobbyResponseMapper hobbyResponseMapper) {
        this.hobbyRepository = hobbyRepository;
        this.hobbyResponseMapper = hobbyResponseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<HobbyResponseModel> getAllHobbies() {
        List<Hobby> hobbies = hobbyRepository.findAll();
        return hobbyResponseMapper.toResponseModelList(hobbies);
    }

    @Override
    @Transactional(readOnly = true)
    public HobbyResponseModel getHobbyById(String id) {
        Hobby hobby = hobbyRepository.findHobbyByHobbyIdentifier_HobbyId(id)
                .orElseThrow(() -> new NotFoundException("Hobby not found: " + id));

        return hobbyResponseMapper.toResponseModel(hobby);
    }

    @Override
    public HobbyResponseModel createHobby(HobbyRequestModel request) {
        Hobby hobby = new Hobby();

        // Explicit setters (all fields)
        hobby.setHobbyIdentifier(new HobbyIdentifier());
        hobby.setTitle(request.getTitle());
        hobby.setDescription(request.getDescription());
        hobby.setImageUrl(request.getImageUrl());

        Hobby saved = hobbyRepository.save(hobby);
        return hobbyResponseMapper.toResponseModel(saved);
    }

    @Override
    public HobbyResponseModel updateHobby(String id, HobbyRequestModel request) {
        Hobby existing = hobbyRepository.findHobbyByHobbyIdentifier_HobbyId(id)
                .orElseThrow(() -> new NotFoundException("Hobby not found: " + id));

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());
        existing.setImageUrl(request.getImageUrl());

        Hobby updated = hobbyRepository.save(existing);
        return hobbyResponseMapper.toResponseModel(updated);
    }


    @Override
    public void deleteHobby(String id) {
        if (!hobbyRepository.existsHobbyByHobbyIdentifier_HobbyId(id)) {
            throw new NotFoundException("Hobby not found: " + id);
        }
        hobbyRepository.deleteHobbyByHobbyIdentifier_HobbyId(id);
    }

}
