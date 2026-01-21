package com.oliviergingras.portfolio.hobbysubdomain.presentationLayer;

import com.oliviergingras.portfolio.hobbysubdomain.businessLayer.HobbyService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api")
public class HobbyController {


    private final HobbyService hobbyService;

    public HobbyController(HobbyService hobbyService) {
        this.hobbyService = hobbyService;
    }

    @GetMapping("/public/hobbies")
    public ResponseEntity<List<HobbyResponseModel>> getAllHobbies() {
        return ResponseEntity.ok(hobbyService.getAllHobbies());
    }

    @GetMapping("/public/hobbies/{id}")
    public ResponseEntity<HobbyResponseModel> getHobbyById(@PathVariable String id) {
        return ResponseEntity.ok(hobbyService.getHobbyById(id));
    }

    @PostMapping("/admin/hobbies")
    public ResponseEntity<HobbyResponseModel> createHobby(@Valid @RequestBody HobbyRequestModel request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(hobbyService.createHobby(request));
    }

    @PutMapping("/admin/hobbies/{id}")
    public ResponseEntity<HobbyResponseModel> updateHobby(@PathVariable String id,
                                                          @Valid @RequestBody HobbyRequestModel request) {
        return ResponseEntity.ok(hobbyService.updateHobby(id, request));
    }

    @DeleteMapping("/admin/hobbies/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteHobby(@PathVariable String id) {
        hobbyService.deleteHobby(id);
    }
}
