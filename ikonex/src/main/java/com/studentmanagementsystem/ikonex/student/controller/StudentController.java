package com.studentmanagementsystem.ikonex.student.controller;

import com.studentmanagementsystem.ikonex.student.DTO.StudentResult;
import com.studentmanagementsystem.ikonex.student.DTO.StudentRequest;
import com.studentmanagementsystem.ikonex.student.DTO.StudentResponse;
import com.studentmanagementsystem.ikonex.student.service.StudentService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
@Slf4j
public class StudentController {
    private final StudentService service;

    // Create
    @PostMapping
    public ResponseEntity<?> createStudent(@RequestBody StudentRequest request) {
        try {
            StudentResponse response = service.createStudent(request);
            log.info("Student Created Successfully");
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to create Class Stream");
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // Get All
    @GetMapping
    public ResponseEntity<?> getStudents() {
        try {
            List<StudentResponse> response = service.getStudents();
            log.info("Students Found Successfully");
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to get students");
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // Get One
    @GetMapping("/{id}")
    public ResponseEntity<?> getStudent(@PathVariable Long id) {
        try {
            StudentResponse response = service.getStudent(id);
            log.info("Student with ID {} Found Successfully", id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to get student with ID {}", id);
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateStudent(@PathVariable Long id, @RequestBody StudentRequest request) {
        try {
            StudentResponse response = service.updateStudent(id, request);
            log.info("Student with ID {} Updated Successfully", id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to update student with ID {}", id);
            HashMap<String, Object> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // Delete
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Long id) {
        try {
            //
            service.deleteStudent(id);
            HashMap<String,String> map = new HashMap<>();
            map.put("message","Class Stream has been deleted successfully");
            return ResponseEntity.status(HttpStatus.OK).body(map);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    // view students belonging to a given class stream
    @GetMapping("/stream/{streamId}")
    public ResponseEntity<?> getStudentsBelongingToStreamId(@PathVariable Long streamId) {
        try  {
            List<StudentResponse> response = service.getStudentsBelongingToStreamId(streamId);
            log.info("Students belonging to stream with ID {} found successfully", streamId);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to get student with streamId {}", streamId);
            HashMap<String,String> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
    @GetMapping("/{id}/results")
    public ResponseEntity<?> getStudentsResult(@PathVariable Long id) {
        try {
            log.info("Finding results for student with ID {}", id);
            StudentResult response = service.getStudentResults(id);
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to get results for student with ID {}", id);
            HashMap<String, String> map = new HashMap<>();
            map.put("message", e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
}
