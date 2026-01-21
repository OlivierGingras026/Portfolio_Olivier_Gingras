package com.oliviergingras.portfolio.educationsubdomain.presentationLayer;

import com.oliviergingras.portfolio.educationsubdomain.businessLayer.EducationService;
import com.oliviergingras.portfolio.educationsubdomain.dataAccessLayer.EducationRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class EducationController {


    private final EducationService educationService;

    public EducationController(EducationService educationService) {
        this.educationService = educationService;
    }

    @GetMapping("/public/educations")
    public ResponseEntity<List<EducationResponseModel>> getAllEducations() {
        return ResponseEntity.ok(educationService.getAllEducations());
    }

    @GetMapping("/public/educations/{id}")
    public ResponseEntity<EducationResponseModel> getEducationById(@PathVariable String id) {
        return ResponseEntity.ok(educationService.getEducationById(id));
    }

    @PostMapping("/admin/educations")
    public ResponseEntity<EducationResponseModel> createEducation(@Valid @RequestBody EducationRequestModel request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(educationService.createEducation(request));
    }

    @PutMapping("/admin/educations/{id}")
    public ResponseEntity<EducationResponseModel> updateEducation(@PathVariable String id,
                                                                  @Valid @RequestBody EducationRequestModel request) {
        return ResponseEntity.ok(educationService.updateEducation(id, request));
    }

    @DeleteMapping("/admin/educations/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEducation(@PathVariable String id) {
        educationService.deleteEducation(id);
    }
}
