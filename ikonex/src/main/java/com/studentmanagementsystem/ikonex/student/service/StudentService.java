package com.studentmanagementsystem.ikonex.student.service;

import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.classStream.repository.ClassStreamRepo;
import com.studentmanagementsystem.ikonex.student.DTO.StudentRequest;
import com.studentmanagementsystem.ikonex.student.DTO.StudentResponse;
import com.studentmanagementsystem.ikonex.student.enums.Gender;
import com.studentmanagementsystem.ikonex.student.enums.Status;
import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.student.repository.StudentRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
    private final StudentRepo repository;
    private final ClassStreamRepo classStreamRepo;

    // create
    public StudentResponse createStudent(StudentRequest studentRequest) {
        try {
            //
            log.info("Inside createStudent method");

            ClassStream classStream;
            if (studentRequest.getClassStreamId() != null) {
                classStream = classStreamRepo.findById(studentRequest.getClassStreamId())
                        .orElseThrow(() -> new RuntimeException("Specified ClassStream Not Found"));
            } else {
                throw new RuntimeException("Class Stream ID is required!");
            }

            Student student = Student.builder()
                    .admissionNumber(studentRequest.getAdmissionNumber())
                    .firstName(studentRequest.getFirstName())
                    .lastName(studentRequest.getLastName())
                    .gender(Gender.valueOf(studentRequest.getGender()))
                    .dateOfBirth(studentRequest.getDateOfBirth())
                    .classStream(classStream)
                    .status(studentRequest.getStatus() != null ? Status.valueOf(studentRequest.getStatus()) : Status.ACTIVE)
                    .build();
            final Student savedStudent = repository.save(student);
            return mapper(savedStudent);
        } catch (Exception e) {
            log.error("Exception occurred while trying to create student");
            log.error(e.getMessage());
            throw e;
        }
    }

    // get all
    public List<StudentResponse> getStudents() {
        try {
            return repository.findAll()
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Exception occurred while trying to getStudents");
            log.error(e.getMessage());
            throw e;
        }
    }

    // get ome
    public StudentResponse getStudent(Long id) {
        try {
            log.info("Inside getStudent method");
            Student response = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student with ID " + id + "not found"));
            return mapper(response);
        } catch (Exception e) {
            log.error("Exception occurred while trying to getStudent");
            log.error(e.getMessage());
            throw e;
        }
    }

    // update
    public StudentResponse updateStudent(Long id, StudentRequest studentRequest) {
        try {
            log.info("Inside updateStudent method");
            Student student = repository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Student with ID " + id + "not found"));
            if (studentRequest.getFirstName() != null) {
                student.setFirstName(studentRequest.getFirstName());
            }
            if (studentRequest.getLastName() != null) {
                student.setLastName(studentRequest.getLastName());
            }
            if (studentRequest.getGender() != null) {
                student.setGender(Gender.valueOf(studentRequest.getGender()));
            }
            if (studentRequest.getDateOfBirth() != null) {
                student.setDateOfBirth(studentRequest.getDateOfBirth());
            }
            if (studentRequest.getAdmissionNumber() != null) {
                student.setAdmissionNumber(studentRequest.getAdmissionNumber());
            }
            if (studentRequest.getClassStreamId() != null) {
                ClassStream classStream = classStreamRepo.findById(studentRequest.getClassStreamId())
                        .orElseThrow(() -> new RuntimeException("Class Stream with ID " + studentRequest.getClassStreamId() + "not found"));
                student.setClassStream(classStream);
            }
            if (studentRequest.getStatus() != null) {
                student.setStatus(Status.valueOf(studentRequest.getStatus()));
            }
            student =  repository.save(student);
            return mapper(student);
        } catch (Exception e) {
            log.error("Exception occurred while trying to update Student");
            log.error(e.getMessage());
            throw e;
        }
    }

    // delete
    public void deleteStudent(Long id) {
        try {
            log.info("Inside deleteStudent method");
            repository.deleteById(id);
        }  catch (Exception e) {
            log.error("Exception occurred while trying to deleteStudent");
            log.error(e.getMessage());
            throw e;
        }
    }
    // mapper
    private StudentResponse mapper(Student student){
        DateTimeFormatter dateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

        return StudentResponse.builder()
                .id(student.getId())
                .admissionNumber(student.getAdmissionNumber())
                .firstName(student.getFirstName())
                .lastName(student.getLastName())
                .gender(student.getGender().name())
                .status(student.getStatus().name())
                .dateOfBirth(student.getDateOfBirth())
                .classStreamName(student.getClassStream().getName())
                .createdAt(student.getCreatedAt() != null ? LocalDate.parse(student.getCreatedAt().format(dateTimeFormatter)) : null)
                .assessmentScores(student.getAssessmentScores())
                .build();
    }

    // students belonging to a particular stream
    public List<StudentResponse> getStudentsBelongingToStreamId(Long streamId) {
        try {
            log.info("Inside getStudentsBelongingToStreamId method");
            return classStreamRepo.getStudentsBelongingToStreamId(streamId)
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error("Exception occurred while trying to get students belonging to stream with id {}", streamId);
            log.error(e.getMessage());
            throw e;
        }
    }
}
