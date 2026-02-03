package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

import com.oliviergingras.portfolio.cvsubdomain.businessLayer.CVFileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/v1/cv")
public class CVFileController {
    private final CVFileService cvFileService;

    public CVFileController(CVFileService cvFileService) {
        this.cvFileService = cvFileService;
    }

    @GetMapping
    public CVFileResponseModel getActiveCV(@RequestParam(value = "isFrench", defaultValue = "false") Boolean isFrench) {
        return cvFileService.getActiveCV(isFrench);
    }

    @GetMapping("/all")
    public List<CVFileResponseModel> getAllCVs() {
        return cvFileService.getAllCVs();
    }

    @GetMapping("/download/{cvId}")
    public ResponseEntity<ByteArrayResource> downloadCV(@PathVariable String cvId) {
        byte[] data = cvFileService.downloadCV(cvId);
        ByteArrayResource resource = new ByteArrayResource(data);
        return ResponseEntity.ok()
            .contentType(MediaType.APPLICATION_PDF)
            .contentLength(data.length)
            .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"cv.pdf\"")
            .body(resource);
    }

    @PostMapping("/upload")
    public CVFileResponseModel uploadCV(@RequestParam("file") MultipartFile file, @RequestParam(value = "isFrench", defaultValue = "false") Boolean isFrench) throws IOException {
        CVFileRequestModel request = new CVFileRequestModel(
            file.getOriginalFilename(),
            file.getBytes(),
            file.getSize(),
            isFrench
        );
        return cvFileService.uploadCV(request);
    }

    @DeleteMapping("/{cvId}")
    public void deleteCV(@PathVariable String cvId) {
        cvFileService.deleteCV(cvId);
    }

    @PutMapping("/{cvId}/activate")
    public CVFileResponseModel activateCV(@PathVariable String cvId) {
        return cvFileService.activateCV(cvId);
    }

    @PutMapping("/{cvId}/language")
    public CVFileResponseModel updateCVLanguage(@PathVariable String cvId, @RequestParam Boolean isFrench) {
        return cvFileService.updateCVLanguage(cvId, isFrench);
    }

    @PutMapping("/{cvId}")
    public CVFileResponseModel updateCVFile(@PathVariable String cvId, @RequestParam("file") MultipartFile file, @RequestParam(value = "isFrench", defaultValue = "false") Boolean isFrench) throws IOException {
        return cvFileService.updateCVFile(cvId, file.getBytes(), file.getOriginalFilename(), file.getSize(), isFrench);
    }
}
