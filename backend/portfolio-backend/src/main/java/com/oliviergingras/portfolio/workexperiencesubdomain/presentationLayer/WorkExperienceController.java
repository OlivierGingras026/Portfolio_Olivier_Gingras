package com.oliviergingras.portfolio.workexperiencesubdomain.presentationLayer;

import com.oliviergingras.portfolio.workexperiencesubdomain.businessLayer.WorkExperienceService;
import com.oliviergingras.portfolio.workexperiencesubdomain.dataAccessLayer.WorkExperienceRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class WorkExperienceController {


    private final WorkExperienceService workExperienceService;

    public WorkExperienceController(WorkExperienceService workExperienceService) {
        this.workExperienceService = workExperienceService;
    }

    @GetMapping("/public/workexperiences")
    public ResponseEntity<List<WorkExperienceResponseModel>> getAllWorkExperiences() {
        return ResponseEntity.ok(workExperienceService.getAllWorkExperiences());
    }

    @GetMapping("/public/workexperiences/{id}")
    public ResponseEntity<WorkExperienceResponseModel> getWorkExperienceById(@PathVariable String id) {
        return ResponseEntity.ok(workExperienceService.getWorkExperienceById(id));
    }

    @PostMapping("/admin/workexperiences")
    public ResponseEntity<WorkExperienceResponseModel> createWorkExperience(@Valid @RequestBody WorkExperienceRequestModel request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(workExperienceService.createWorkExperience(request));
    }

    @PutMapping("/admin/workexperiences/{id}")
    public ResponseEntity<WorkExperienceResponseModel> updateWorkExperience(@PathVariable String id,
                                                                            @Valid @RequestBody WorkExperienceRequestModel request) {
        return ResponseEntity.ok(workExperienceService.updateWorkExperience(id, request));
    }

    @DeleteMapping("/admin/workexperiences/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteWorkExperience(@PathVariable String id) {
        workExperienceService.deleteWorkExperience(id);
    }
}
