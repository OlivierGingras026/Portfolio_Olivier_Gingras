package com.oliviergingras.portfolio.skillsubdomain.businessLayer;


import com.oliviergingras.portfolio.common.NotFoundException;
import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.Skill;
import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.SkillIdentifier;
import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.SkillRepository;
import com.oliviergingras.portfolio.skillsubdomain.mappingLayer.SkillRequestMapper;
import com.oliviergingras.portfolio.skillsubdomain.mappingLayer.SkillResponseMapper;
import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillRequestModel;
import com.oliviergingras.portfolio.skillsubdomain.presentationLayer.SkillResponseModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;
    private final SkillResponseMapper skillResponseMapper;

    public SkillServiceImpl(SkillRepository skillRepository,
                            SkillRequestMapper skillRequestMapper,
                            SkillResponseMapper skillResponseMapper) {
        this.skillRepository = skillRepository;
        this.skillResponseMapper = skillResponseMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SkillResponseModel> getAllSkills() {
        List<Skill> skills = skillRepository.findAll();
        return skillResponseMapper.toResponseModelList(skills);
    }

    @Override
    @Transactional(readOnly = true)
    public SkillResponseModel getSkillById(String id) {
        Skill skill = skillRepository.findSkillBySkillIdentifier_SkillId(id)
                .orElseThrow(() -> new NotFoundException("Skill not found: " + id));

        return skillResponseMapper.toResponseModel(skill);
    }

    @Override
    public SkillResponseModel createSkill(SkillRequestModel request) {
        Skill skill = new Skill();

        // Explicit setters (all fields)
        skill.setSkillIdentifier(new SkillIdentifier());
        skill.setTitle(request.getTitle());
        skill.setDescription(request.getDescription());

        Skill saved = skillRepository.save(skill);
        return skillResponseMapper.toResponseModel(saved);
    }

    @Override
    public SkillResponseModel updateSkill(String id, SkillRequestModel request) {
        Skill existing = skillRepository.findSkillBySkillIdentifier_SkillId(id)
                .orElseThrow(() -> new NotFoundException("Skill not found: " + id));

        existing.setTitle(request.getTitle());
        existing.setDescription(request.getDescription());

        Skill updated = skillRepository.save(existing);
        return skillResponseMapper.toResponseModel(updated);
    }


    @Override
    public void deleteSkill(String id) {
        if (!skillRepository.existsSkillBySkillIdentifier_SkillId(id)) {
            throw new NotFoundException("Skill not found: " + id);
        }
        skillRepository.deleteSkillBySkillIdentifier_SkillId(id);
    }

}
