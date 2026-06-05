package com.studentmanagementsystem.ikonex.subject.controller;

import com.studentmanagementsystem.ikonex.subject.DTO.SubjectRequest;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectResponse;
import com.studentmanagementsystem.ikonex.subject.service.SubjectService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@RequiredArgsConstructor
@Slf4j
public class SubjectController {
    private final SubjectService service;

    // Create
    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody SubjectRequest request) {
        try {
            SubjectResponse response = service.createSubject(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch  (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
    // Get one
    @GetMapping("/{id}")
    private ResponseEntity<?> getSubject(@PathVariable Long id) {
        try {
            log.info("Getting subject with id {}", id);
            SubjectResponse response = service.getSubject(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // Get all
    @GetMapping
    private ResponseEntity<?> getSubjects(@PathVariable Long id) {
        try {
            log.info("Getting all subjects");
            List<SubjectResponse> response = service.getAllSubjecs(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
    // update
    @PutMapping
    private ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody SubjectRequest request) {
        try {
            log.info("Updating subject with id {}", id);
            SubjectResponse response = service.updateSubject(id, request);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // delete
    @DeleteMapping("/{id}")
    private ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        try {
            log.info("Deleting subject with id {}", id);
            service.deleteSubject(id);
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", "Subject with id " + id + " has been deleted");

            return ResponseEntity.status(HttpStatus.OK).body(map);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
}
