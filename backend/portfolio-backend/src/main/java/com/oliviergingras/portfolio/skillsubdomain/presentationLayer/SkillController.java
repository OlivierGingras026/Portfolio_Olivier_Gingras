package com.oliviergingras.portfolio.skillsubdomain.presentationLayer;

import com.oliviergingras.portfolio.skillsubdomain.businessLayer.SkillService;
import com.oliviergingras.portfolio.skillsubdomain.dataAccessLayer.SkillRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class SkillController {


    private final SkillService skillService;

    public SkillController(SkillService skillService) {
        this.skillService = skillService;
    }

    @GetMapping("/public/skills")
    public ResponseEntity<List<SkillResponseModel>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    @GetMapping("/public/skills/{id}")
    public ResponseEntity<SkillResponseModel> getSkillById(@PathVariable String id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    @PostMapping("/admin/skills")
    public ResponseEntity<SkillResponseModel> createSkill(@Valid @RequestBody SkillRequestModel request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(skillService.createSkill(request));
    }

    @PutMapping("/admin/skills/{id}")
    public ResponseEntity<SkillResponseModel> updateSkill(@PathVariable String id,
                                                          @Valid @RequestBody SkillRequestModel request) {
        return ResponseEntity.ok(skillService.updateSkill(id, request));
    }

    @DeleteMapping("/admin/skills/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteSkill(@PathVariable String id) {
        skillService.deleteSkill(id);
    }
}

