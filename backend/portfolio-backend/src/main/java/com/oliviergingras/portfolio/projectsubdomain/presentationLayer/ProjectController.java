package com.oliviergingras.portfolio.projectsubdomain.presentationLayer;

import com.oliviergingras.portfolio.projectsubdomain.businessLayer.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class ProjectController {


    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/public/projects")
    public ResponseEntity<List<ProjectResponseModel>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    @GetMapping("/public/projects/{id}")
    public ResponseEntity<ProjectResponseModel> getProjectById(@PathVariable String id) {
        return ResponseEntity.ok(projectService.getProjectById(id));
    }

    @PostMapping("/admin/projects")
    public ResponseEntity<ProjectResponseModel> createProject(@Valid @RequestBody ProjectRequestModel request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(request));
    }

    @PutMapping("/admin/projects/{id}")
    public ResponseEntity<ProjectResponseModel> updateProject(@PathVariable String id,
                                                              @Valid @RequestBody ProjectRequestModel request) {
        return ResponseEntity.ok(projectService.updateProject(id, request));
    }

    @DeleteMapping("/admin/projects/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteProject(@PathVariable String id) {
        projectService.deleteProject(id);
    }
}
