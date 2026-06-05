package com.studentmanagementsystem.ikonex.subject.service;

import com.studentmanagementsystem.ikonex.subject.DTO.SubjectRequest;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectResponse;
import com.studentmanagementsystem.ikonex.subject.model.Subject;
import com.studentmanagementsystem.ikonex.subject.repository.SubjectRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectService {
    private final SubjectRepo repo;

    // create
    public SubjectResponse createSubject(SubjectRequest subjectRequest) {
        try {
            log.info("Creating a new subject");
            Subject subject = Subject.builder()
                    .name(subjectRequest.getName())
                    .description(subjectRequest.getDescription())
                    .code(subjectRequest.getCode())
                    .build();
            final Subject savedSubject = repo.save(subject);
            log.info("Subject created with id {}", savedSubject.getId());
            return mapper(savedSubject);
        } catch  (Exception e) {
            log.error("Error while creating a new subject");
            throw e;
        }
    }


    // mapper
    private SubjectResponse mapper(Subject subject) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return SubjectResponse.builder()
                .code(subject.getCode())
                .name(subject.getName())
                .description(subject.getDescription())
                .createdAt(LocalDateTime.parse(subject.getCreatedAt().format(formatter)))
                .studentScores(subject.getStudentScores())
                .build();
    }

    // Get one
    public SubjectResponse getSubject(Long id) {
        try {
            log.info("Getting subject with id {}", id);
            Subject subject = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Subject with id " + id + " not found"));
            return mapper(subject);
        } catch   (Exception e) {
            log.error("Error while getting subject");
            throw e;
        }
    }

    // Get all
    public List<SubjectResponse> getAllSubjecs(Long id) {
        try {
            log.info("Getting all subjects with id {}", id);
            return repo.findAll()
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch  (Exception e) {
            log.error("Error while getting all subjects");
            throw e;
        }
    }

    // Update
    public SubjectResponse updateSubject(Long id, SubjectRequest request) {
        try {
            log.info("Updating subject with id {}", id);
            Subject subject = repo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Subject with id " + id + " not found"));

            if (request.getName() != null) {
                subject.setName(request.getName());
            }
            if (request.getDescription() != null) {
                subject.setDescription(request.getDescription());
            }
            if (request.getCode() != null) {
                subject.setCode(request.getCode());
            }

            Subject savedSubject = repo.save(subject);

            log.info("Subject updated with id {}", savedSubject.getId());

            return mapper(savedSubject);
        } catch  (Exception e) {
            log.error("Error while updating subject");
            throw e;
        }
    }

    // Delete
    public void deleteSubject(Long id) {
        try {
            log.info("Deleting subject with id {}", id);
            repo.deleteById(id);
        } catch   (Exception e) {
            log.error("Error while deleting subject");
            throw e;
        }
    }
}
