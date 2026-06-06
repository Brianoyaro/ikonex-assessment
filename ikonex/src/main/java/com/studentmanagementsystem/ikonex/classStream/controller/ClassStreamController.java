package com.studentmanagementsystem.ikonex.classStream.controller;

import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamRequest;
import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamResponse;
import com.studentmanagementsystem.ikonex.classStream.service.ClassStreamService;
import com.studentmanagementsystem.ikonex.subject.DTO.ClassPosition;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequestMapping("/api/class-streams")
@RequiredArgsConstructor
@Slf4j
public class ClassStreamController {
    private final ClassStreamService service;

    //Create
    @PostMapping
    public ResponseEntity<?> createClassStream(@RequestBody ClassStreamRequest classStream) {
        try {
            ClassStreamResponse response = service.createClassStream(classStream);
            log.debug(response.toString());
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        }  catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    //Read - all
    @GetMapping
    public ResponseEntity<?> getAllClassStreams() {
        try {
            List<ClassStreamResponse> classStreams = service.getAllClassStreams();
            log.debug(classStreams.toString());
            return ResponseEntity.status(HttpStatus.OK).body(classStreams);
        } catch (Exception e)  {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    //read - one
    @GetMapping("/{id}")
    public ResponseEntity<?> getClassStream(@PathVariable Long id) {
        try {
            ClassStreamResponse response = service.getClassStreamById(id);
            log.debug(response.toString());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(map);
        }
    }

    //Update
    @PutMapping("/{id}")
    public ResponseEntity<?> updateClassStream(@PathVariable Long id, @RequestBody ClassStreamRequest classStreamRequest) {
        try {
            ClassStreamResponse response = service.updateClassStream(id, classStreamRequest);
            log.debug(response.toString());
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }

    //Delete
    @DeleteMapping
    public ResponseEntity<?> deleteClassStream(@PathVariable Long id) {
        try {
            //
            service.deleteClassStream(id);
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

    // get overall classStream positions
    @GetMapping("/positions")
    public ResponseEntity<?> getClassStreamPositions() {
        try {
            log.info("getClassStreamPositions called");
            List<ClassPosition> response = service.getOverallClassPositions();
            return ResponseEntity.status(HttpStatus.OK).body(response);
        } catch (Exception e) {
            log.error(e.getMessage());
            HashMap<String,Object> map = new HashMap<>();
            map.put("message",e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(map);
        }
    }
}
