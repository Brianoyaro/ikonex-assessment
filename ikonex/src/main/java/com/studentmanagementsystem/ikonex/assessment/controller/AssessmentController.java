package com.studentmanagementsystem.ikonex.assessment.controller;

import com.studentmanagementsystem.ikonex.assessment.DTO.AssessmentRequest;
import com.studentmanagementsystem.ikonex.assessment.DTO.AssessmentResponse;
import com.studentmanagementsystem.ikonex.assessment.service.AssessmentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/assessments")
@RequiredArgsConstructor
@Slf4j
public class AssessmentController {
    private final AssessmentService assessmentService;

    // Create
    @PostMapping
    public ResponseEntity<?> createAssessment(@Valid @RequestBody AssessmentRequest request) {
        try {
            log.debug("Creating assessment with request {}", request);
            AssessmentResponse assessmentResponse = assessmentService.createAssessment(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(assessmentResponse);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get One
    @GetMapping("/{id}")
    public ResponseEntity<?> getAssessment(@PathVariable Long id) {
        try {
            log.debug("Getting assessment with id {}", id);
            AssessmentResponse assessmentResponse = assessmentService.getAssessment(id);
            return ResponseEntity.status(HttpStatus.OK).body(assessmentResponse);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get All
    @GetMapping
    public ResponseEntity<?> getAssessments() {
        try {
            log.debug("Getting all assessments");
            List<AssessmentResponse> responses = assessmentService.getAllAssessments();
            return ResponseEntity.status(HttpStatus.OK).body(responses);
        }  catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateAssessment(@PathVariable Long id, @Valid @RequestBody AssessmentRequest request) {
        try {
            log.debug("Updating assessment with id {}", id);
            AssessmentResponse response = assessmentService.updateAssessment(id, request);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }  catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteAssessment(@PathVariable Long id) {
        try {
            log.debug("Deleting assessment with id {}", id);
            assessmentService.deleteAssessment(id);
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", "Assessment has been deleted");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }   catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
