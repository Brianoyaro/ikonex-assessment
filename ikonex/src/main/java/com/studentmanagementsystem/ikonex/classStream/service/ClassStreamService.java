package com.studentmanagementsystem.ikonex.classStream.service;

import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamRequest;
import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamResponse;
import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.classStream.repository.ClassStreamRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ClassStreamService {
    private ClassStreamRepo repository;

    // Create
    public ClassStreamResponse createClassStream(ClassStreamRequest request) {
        try {
            log.info("Start saving Class Stream");
            ClassStream classStream = ClassStream.builder()
                    .name(request.getName())
                    .description(request.getDescription())
                    .formLevel(request.getLevel())
                    .build();

            final ClassStream savedClassStream = repository.save(classStream);
            log.info("Saved Class Stream with id: " + savedClassStream.getId());
            return mapper(savedClassStream);
        } catch (Exception e) {
            log.error("Exception occurred while trying to create Class Stream");
            log.error(e.getMessage());
            throw e;
        }
    }

    // Get All Streams
    public List<ClassStreamResponse> getAllClassStreams() {
        try {
            log.info("Start getting Class Stream");
            return repository.findAll()
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        }  catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Get One Stream
    public ClassStreamResponse getClassStreamById(Long id) {
        try {
            log.info("Start getting Class Stream with id: " + id);
            ClassStream classStream = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("ClassStream with id: " + id + " not found"));
            return mapper(classStream);
        } catch  (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Update a stream
    @Transactional
    public ClassStreamResponse updateClassStream(Long id, ClassStreamRequest request) {
        try {
            log.info("Start updating Class Stream");
            // check if the classStream exists
            ClassStream classStream = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("ClassStream with id: " + id + " not found"));
            if (request.getName() != null) {
                classStream.setName(request.getName());
            }
            if (request.getDescription() != null) {
                classStream.setDescription(request.getDescription());
            }
            if (request.getLevel() != null) {
                classStream.setFormLevel(request.getLevel());
            }
            classStream = repository.save(classStream);
            log.info("Updated Class Stream with id: " + classStream.getId());
            return mapper(classStream);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Delete a Stream
    @Transactional
    public void deleteClassStream(Long id) {
        try {
            log.info("Start deleting Class Stream with id: " + id);
            repository.deleteById(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // mapper
    private ClassStreamResponse mapper(ClassStream classStream) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return ClassStreamResponse.builder()
                .id(classStream.getId())
                .name(classStream.getName())
                .level(classStream.getFormLevel())
                .description(classStream.getDescription())
                .studentList(classStream.getStudentList())
                .createdAt(classStream.getCreatedAt() != null ? LocalDateTime.parse(classStream.getCreatedAt().format(formatter)) : null)
                .classSubjectList(classStream.getClassSubjects())
                .build();
    }
}
