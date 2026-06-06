package com.studentmanagementsystem.ikonex.subject.controller;

import com.studentmanagementsystem.ikonex.subject.DTO.*;
import com.studentmanagementsystem.ikonex.subject.service.SubjectService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/subjects")
@RequiredArgsConstructor
@Slf4j
public class SubjectController {
    private final SubjectService service;

    // Create
    @PostMapping
    public ResponseEntity<?> createSubject(@Valid @RequestBody SubjectRequest request) {
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
    public ResponseEntity<?> getSubject(@PathVariable Long id) {
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
    public ResponseEntity<?> getSubjects() {
        try {
            log.info("Getting all subjects");
            List<SubjectResponse> response = service.getAllSubjects();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return   ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
    // update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @Valid @RequestBody SubjectRequest request) {
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
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
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

    // get subject positions for a given stream
    @GetMapping("/position/{classStreamId}")
    public ResponseEntity<?> getSubjectPosition(@PathVariable Long classStreamId) {
        try {
            log.info("Getting subject position with id {}", classStreamId);
            List<SubjectPosition> response = service.getClassSubjectPositions(classStreamId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // assign a subject to a class stream i.e. create a classSubject
    @PostMapping("/assign-class")
    public ResponseEntity<?> assignClassSubject(@RequestBody ClassSubjectRequest request) {
        try {
            log.info("assigning a subject to a class");
            ClassSubjectResponse response = service.createClassSubject(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // get all classSubjects belonging to a classStream
    @GetMapping("/class-stream/{id}")
    public ResponseEntity<?> getClassSubjectsForAGivenStream(@PathVariable Long id) {
        try {
            log.info("Getting class subjects for class_stream with id {}", id);
            List<ClassSubjectResponse> response = service.getAllClassSubjectsForAGivenStream(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }  catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // get all classSubjects
    @GetMapping("/class-stream/all")
    public ResponseEntity<?> getClassSubjectsForAGivenStream() {
        try {
            log.info("Getting all class subjects");
            List<ClassSubjectResponse> response = service.getAllClassSubjects();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        }  catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return  ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // delete a classSubject
    @DeleteMapping("/stream/{id}")
    public ResponseEntity<?> deleteClassSubject(@PathVariable Long id) {
        try {
            log.info("Deleting class subject with id {}", id);
            service.deleteClassSubject(id);
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
