package com.studentmanagementsystem.ikonex.subject.service;

import com.studentmanagementsystem.ikonex.classStream.repository.ClassStreamRepo;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectPosition;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectRequest;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectResponse;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import com.studentmanagementsystem.ikonex.subject.model.Subject;
import com.studentmanagementsystem.ikonex.subject.repository.ClassSubjectRepo;
import com.studentmanagementsystem.ikonex.subject.repository.SubjectRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class SubjectService {
    private final SubjectRepo subjectRepo;
    private final ClassSubjectRepo classSubjectRepo;
    private final ClassStreamRepo classStreamRepo;

    // create
    public SubjectResponse createSubject(SubjectRequest subjectRequest) {
        try {
            log.info("Creating a new subject");
            Subject subject = Subject.builder()
                    .name(subjectRequest.getName())
                    .description(subjectRequest.getDescription())
                    .code(subjectRequest.getCode())
                    .build();
            final Subject savedSubject = subjectRepo.save(subject);
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
            Subject subject = subjectRepo.findById(id)
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
            return subjectRepo.findAll()
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
            Subject subject = subjectRepo.findById(id)
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

            Subject savedSubject = subjectRepo.save(subject);

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
            subjectRepo.deleteById(id);
        } catch   (Exception e) {
            log.error("Error while deleting subject");
            throw e;
        }
    }

    // get classSubject positions for a given stream
    public List<SubjectPosition> getClassSubjectPositions(Long classId) {
        List<ClassSubject> classSubjects = classSubjectRepo.findByClassId(classId);

        List<SubjectPosition> subjectPositions = new ArrayList<>();
        classSubjects.forEach(classSubject -> {
            // get total
            AtomicReference<Double> total = new AtomicReference<>(0.0);
            classSubject.getSubject().getStudentScores().forEach(score -> {
                total.updateAndGet(v -> v + score.getStudentScore());
            });
            // get average
            int totalStudentsWhoTookTheSubject = classSubject.getClassStream().getStudentList().size();
            Double average = total.get() / totalStudentsWhoTookTheSubject;
            //
            SubjectPosition subjectPosition = SubjectPosition.builder()
                    .classStreamName(classSubject.getClassStream().getName())
                    .subjectName(classSubject.getSubject().getName())
                    .classSubjectTotal(total.get())
                    .classSubjectAverage(average)
                    .build();
            subjectPositions.add(subjectPosition);
        });
        // sort subjectPositions on classAverage and setClassSubjectPosition
        subjectPositions.sort(Comparator.comparingDouble(SubjectPosition::getClassSubjectAverage));
        for (int i = 0; i <= subjectPositions.size() - 1; i++) {
            subjectPositions.get(i).setClassSubjectPosition(i + 1);
        }
        return subjectPositions;
    }
}
