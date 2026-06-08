package com.studentmanagementsystem.ikonex.classStream.service;

import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamRequest;
import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamResponse;
import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamStudentObject;
import com.studentmanagementsystem.ikonex.classStream.DTO.ClassStreamStudentResult;
import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.classStream.repository.ClassStreamRepo;
import com.studentmanagementsystem.ikonex.student.DTO.StudentResponse;
import com.studentmanagementsystem.ikonex.student.DTO.StudentResult;
import com.studentmanagementsystem.ikonex.student.service.StudentService;
import com.studentmanagementsystem.ikonex.subject.DTO.ClassPosition;
import com.studentmanagementsystem.ikonex.subject.DTO.SubjectResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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
public class ClassStreamService {
    private final ClassStreamRepo repository;
    private final StudentService studentService;

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

        List<ClassStreamStudentObject> studentResponseList = new ArrayList<>();
        classStream.getStudentList().forEach(student -> {
            //
            ClassStreamStudentObject studentResponse = ClassStreamStudentObject.builder()
                    .id(student.getId())
                    .admissionNumber(student.getAdmissionNumber())
                    .firstName(student.getFirstName())
                    .lastName(student.getLastName())
                    .gender(String.valueOf(student.getGender()))
                    .status(String.valueOf(student.getStatus()))
                    .dateOfBirth(student.getDateOfBirth())
                    .build();
            studentResponseList.add(studentResponse);
        });

        List<SubjectResponse> subjectResponseList = new ArrayList<>();
        classStream.getClassSubjects().forEach(subject -> {
            //
            SubjectResponse subjectResponse = SubjectResponse.builder()
                    .id(subject.getId())
                    .name(subject.getSubject().getName())
                    .description(subject.getSubject().getDescription())
                    .code(subject.getSubject().getCode())
                    .createdAt(subject.getSubject().getCreatedAt())
                    .build();
            subjectResponseList.add(subjectResponse);
        });

        return ClassStreamResponse.builder()
                .id(classStream.getId())
                .name(classStream.getName())
                .level(classStream.getFormLevel())
                .description(classStream.getDescription())
                .studentList(studentResponseList)// instead or returning the student list, How about returning a list of studentResponse
                .createdAt(classStream.getCreatedAt())
                .classSubjectList(subjectResponseList)
                .build();
    }

    // get overall class positions
    public List<ClassPosition> getOverallClassPositions() {
        List<ClassStream> classStreams = repository.findAll();
        List<ClassPosition> classPositions = new ArrayList<>();

        classStreams.forEach(classStream -> {
            AtomicReference<Double> total = new AtomicReference<>(0.0);
            classStream.getClassSubjects().forEach(classSubject -> {
                classSubject.getStudentScores().forEach(score -> {
                    total.updateAndGet(v -> v + score.getStudentScore());
                });
            });

            int totalStudents = classStream.getStudentList().size();
            Double average = total.get() / totalStudents;

            ClassPosition classPosition = ClassPosition.builder()
                    .classStreamName(classStream.getName())
                    .totalStudents(totalStudents)
                    .classTotal(total.get())
                    .classAverage(average)
                    //.classPosition()//TODO. Handled below.
                    .build();
            classPositions.add(classPosition);
        });
        classPositions.sort(Comparator.comparingDouble(ClassPosition::getClassAverage).reversed());
        for (int i = 0; i <= classPositions.size() - 1; i++) {
            classPositions.get(i).setClassPosition(i + 1);
        }
        return classPositions;
    }

    // get class report sorted on student's average mark
    public List<ClassStreamStudentResult> getClassReport(Long classStreamId) {
        ClassStream classStream = repository.findById(classStreamId)
                .orElseThrow(() -> new RuntimeException("ClassStream with id: " + classStreamId + " not found"));
        List<ClassStreamStudentResult> classStreamStudentResult = new ArrayList<>();
        //
        classStream.getStudentList().forEach(student -> {
            // get the student report using student service
            StudentResult studentResult = studentService.getStudentResults(student.getId());
            // Create a new ClassStreamStudentResult from StudentResult
            ClassStreamStudentResult result = new ClassStreamStudentResult();
            result.setStudentId(studentResult.getStudentId());
            result.setAdmissionNumber(studentResult.getAdmissionNumber());
            result.setStudentName(studentResult.getStudentName());
            result.setClassStream(studentResult.getClassStream());
            result.setSubjects(studentResult.getSubjects());
            result.setOverallTotal(studentResult.getOverallTotal());
            result.setOverallAverage(studentResult.getOverallAverage());
            classStreamStudentResult.add(result);
        });

        // sort the on student overallAverage and set their position
        classStreamStudentResult.sort(Comparator.comparingDouble(StudentResult::getOverallAverage).reversed());
        for (int i = 0; i <= classStreamStudentResult.size() - 1; i++) {
            classStreamStudentResult.get(i).setStudentPosition(i + 1);
        }

        return classStreamStudentResult;
    }
}
