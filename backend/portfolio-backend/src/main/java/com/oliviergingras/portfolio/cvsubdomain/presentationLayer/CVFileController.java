package com.oliviergingras.portfolio.cvsubdomain.presentationLayer;

import com.oliviergingras.portfolio.cvsubdomain.businessLayer.CVFileService;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@RestController
@RequestMapping("/api/v1/cv")
public class CVFileController {
    private final CVFileService cvFileService;

    public CVFileController(CVFileService cvFileService) {
        this.cvFileService = cvFileService;
    }

    @GetMapping
    public CVFileResponseModel getActiveCV() {
        return cvFileService.getActiveCV();
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
    public CVFileResponseModel uploadCV(@RequestParam("file") MultipartFile file) throws IOException {
        CVFileRequestModel request = new CVFileRequestModel(
            file.getOriginalFilename(),
            file.getBytes(),
            file.getSize()
        );
        return cvFileService.uploadCV(request);
    }

    @DeleteMapping("/{cvId}")
    public void deactivateCV(@PathVariable String cvId) {
        cvFileService.deactivateCV(cvId);
    }
}
