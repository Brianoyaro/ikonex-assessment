package com.studentmanagementsystem.ikonex.student.service;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.classStream.repository.ClassStreamRepo;
import com.studentmanagementsystem.ikonex.report.DTO.AssessmentScore;
import com.studentmanagementsystem.ikonex.report.DTO.StudentResult;
import com.studentmanagementsystem.ikonex.report.DTO.SubjectResult;
import com.studentmanagementsystem.ikonex.student.DTO.StudentRequest;
import com.studentmanagementsystem.ikonex.student.DTO.StudentResponse;
import com.studentmanagementsystem.ikonex.student.enums.Gender;
import com.studentmanagementsystem.ikonex.student.enums.Status;
import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.student.repository.StudentRepo;
import com.studentmanagementsystem.ikonex.subject.model.Subject;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.Year;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class StudentService {
    private final StudentRepo studentRepo;
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
            final Student savedStudent = studentRepo.save(student);
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
            return studentRepo.findAll()
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
            Student response = studentRepo.findById(id)
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
            Student student = studentRepo.findById(id)
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
            student =  studentRepo.save(student);
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
            studentRepo.deleteById(id);
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

    public void getStudentResults(Long studentId) {
        try {
            log.info("Inside getStudentResults method");
            // get student
            Student student = studentRepo.findById(studentId).orElseThrow(() -> new RuntimeException("Student with ID " + studentId + "not found"));
            //ClassStream studentClassStream = student.getClassStream();
            List<Score> studentAssessmentScores= student.getAssessmentScores();
            int totalSubjects = student.getClassStream().getClassSubjects().size();
            Double overAllTotal = 0.0;
            for (Score score : studentAssessmentScores) {
                overAllTotal += score.getStudentScore();
            }
            Double overAllAverage = overAllTotal / totalSubjects;

            // Actual data processing
            /* subjectResult DTO */
            List<SubjectResult> subjectResults = subjectResultMapper(studentAssessmentScores);

            /* studentResult DTO*/
            StudentResult studentResult = StudentResult.builder()
                    .studentId(student.getId())
                    .studentName(student.getFirstName() + " " + student.getLastName())
                    .admissionNumber(student.getAdmissionNumber())
                    .classStream(student.getClassStream().getName())
                    .overallTotal(overAllTotal)
                    .overallAverage(overAllAverage)
                    .subjects(subjectResults)
                    .build();
        } catch  (Exception e) {
            log.error("Exception occurred while trying to getStudentResults");
            log.error(e.getMessage());
            throw e;
        }
    }
    private List<SubjectResult> subjectResultMapper(List<Score> studentAssessmentScores) {
        // group by subject
        Map<Subject, List<Score>> groupedStudentAssessmentScores = studentAssessmentScores
                .stream()
                .collect(Collectors.groupingBy(s -> s.getClassSubject().getSubject()));
        // iterate the list
        List<SubjectResult> subjectResultsResponse = new ArrayList<>();
        for (Map.Entry<Subject, List<Score>> entry : groupedStudentAssessmentScores.entrySet()) {
            Double overAllTotal = 0.0;
            for (Score score : entry.getValue()) {
                overAllTotal += score.getStudentScore();
            }
            int totalSubjects = entry.getValue().size();
            Double overAllAverage = overAllTotal / totalSubjects;
            String subjectGrade = getGrade(overAllTotal);
            List<AssessmentScore> assessmentScores = assessmentScoresMapper(entry.getValue());

            SubjectResult subjectResult = SubjectResult.builder()
                    .subjectId(entry.getKey().getId())
                    .subjectName(entry.getKey().getName())
                    .scores(assessmentScores)
                    .total(overAllTotal)
                    .average(overAllAverage)
                    .grade(subjectGrade)
                    .build();

            // add this subject result to the subject results response list
            subjectResultsResponse.add(subjectResult);
        }
        return subjectResultsResponse;
    }
    private List<AssessmentScore> assessmentScoresMapper(List<Score> studentAssessmentScores) {
        //name, score,term, year
        List<AssessmentScore> assessmentScoresResponse = new ArrayList<>();
        for (Score score : studentAssessmentScores) {
            AssessmentScore assessmentScore = AssessmentScore.builder()
                    .studentScore(score.getStudentScore())
                    .assessmentName(score.getAssessment().getAssessmentName())
                    .assessmentTerm(String.valueOf(score.getAssessment().getTerm()))
                    .assessmentYear(Year.from(score.getAssessment().getYear()))
                    .build();

            assessmentScoresResponse.add(assessmentScore);
        }
        return assessmentScoresResponse;
    }
    private String getGrade(Double overAllTotal) {
        if (overAllTotal > 79) {
            return "A";
        }  else if (overAllTotal > 59) {
            return "B";
        }  else if (overAllTotal > 49 ) {
            return "C";
        } else if (overAllTotal > 39 ) {
            return "D";
        } else {
            return "E";
        }
    }

}
