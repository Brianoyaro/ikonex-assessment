package com.studentmanagementsystem.ikonex.assessment.controller;

import com.studentmanagementsystem.ikonex.assessment.DTO.ScoreRequest;
import com.studentmanagementsystem.ikonex.assessment.DTO.ScoreResponse;
import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.assessment.service.ScoreService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/scores")
@RequiredArgsConstructor
@Slf4j
public class ScoreController {
    private final ScoreService scoreService;

    // Create
    @PostMapping
    public ResponseEntity<?> createScore(@Valid @RequestBody ScoreRequest request) {
        try {
            log.info("Inside createScore method");
            ScoreResponse scoreResponse = scoreService.createScore(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(scoreResponse);
        } catch (Exception e) {
            HashMap<String, Object>  response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get one
    @GetMapping("/{id}")
    public ResponseEntity<?> getScore(@PathVariable Long id) {
        try {
            log.info("Inside getScore method");
            ScoreResponse response = scoreService.getScore(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }  catch (Exception e) {
            HashMap<String, Object>  response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Get all
    @GetMapping
    public ResponseEntity<?> getAllScores() {
        try {
            log.info("Inside getAllScores method");
            List<ScoreResponse> responseList = scoreService.getScores();
            return ResponseEntity.status(HttpStatus.OK).body(responseList);
        } catch (Exception e) {
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateScore(@PathVariable Long id, @Valid @RequestBody ScoreRequest request) {
        try {
            log.info("Inside updateScore method");
            ScoreResponse scoreResponse = scoreService.updateScore(id, request);
            return ResponseEntity.status(HttpStatus.OK).body(scoreResponse);
        }  catch (Exception e) {
            HashMap<String, Object>  response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteScore(@PathVariable Long id) {
        try {
            log.info("Inside deleteScore method");
            scoreService.deleteScore(id);
            HashMap<String, Object>  response = new HashMap<>();
            response.put("message", "Score has been deleted");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }   catch (Exception e) {
            HashMap<String, Object>  response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    /*
       - View individual student performance by subject.
       - View class performance for a selected subject.[DONE]
     */

    // get average score for a selected subject per class
    @GetMapping("/class-subject/{classSubjectId}")
    public ResponseEntity<?> getAverageClassSubjectScore(@PathVariable Long classSubjectId) {
        try {
            log.info("Inside getAverageClassSubject method");
            Double averageClassSubjectScore = scoreService.getAverageClassSubjectScore(classSubjectId);
            HashMap<Object, Object> response = new HashMap<>();
            response.put("averageClassSubjectScore", averageClassSubjectScore);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            HashMap<String, Object> response = new HashMap<>();
            response.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
