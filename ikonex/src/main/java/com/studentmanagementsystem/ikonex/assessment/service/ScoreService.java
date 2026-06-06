package com.studentmanagementsystem.ikonex.assessment.service;

import com.studentmanagementsystem.ikonex.assessment.DTO.ScoreRequest;
import com.studentmanagementsystem.ikonex.assessment.DTO.ScoreResponse;
import com.studentmanagementsystem.ikonex.assessment.model.Assessment;
import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.assessment.repository.AssessmentRepo;
import com.studentmanagementsystem.ikonex.assessment.repository.ScoreRepo;
import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.student.repository.StudentRepo;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import com.studentmanagementsystem.ikonex.subject.repository.ClassSubjectRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ScoreService {
    private final ScoreRepo scoreRepo;

    private final AssessmentRepo assessmentRepo;
    private final StudentRepo studentRepo;
    private final ClassSubjectRepo classSubjectRepo;

    // create
    public ScoreResponse createScore(ScoreRequest request) {
        try {
            log.info("Inside createScore method");

            ClassSubject classSubject = classSubjectRepo.findById(request.getClassSubjectId())
                    .orElseThrow(() -> new RuntimeException("ClassSubject not found"));

            Assessment assessment = assessmentRepo.findById(request.getAssessmentId())
                    .orElseThrow(() -> new RuntimeException("Assessment not found"));

            Student student = studentRepo.findById(request.getStudentId())
                    .orElseThrow(() -> new RuntimeException("Student not found"));

            Score score = Score.builder()
                    .studentScore(request.getScore())
                    .classSubject(classSubject)
                    .assessment(assessment)
                    .student(student)
                    .build();
            Score savedScore = scoreRepo.save(score);
            log.info("Score created successfully");
            return mapper(savedScore);
        } catch (Exception e) {
            log.error("Error in createScore method");
            throw e;
        }
    }
    // mapper
    private ScoreResponse mapper(Score score) {
        return ScoreResponse.builder()
                .score(score.getStudentScore())
                .studentAdmissionNumber(Long.valueOf(score.getStudent().getAdmissionNumber()))
                .className(score.getClassSubject().getClassStream().getName())
                .subjectName(score.getClassSubject().getSubject().getName())
                .assessment(score.getAssessment().getAssessmentName() + score.getAssessment().getTerm() +  score.getAssessment().getYear())
                .build();
    }

    // get one
    public ScoreResponse getScore(Long scoreId) {
        try {
            log.info("Inside getScore method");
            Score response =  scoreRepo.findById(scoreId)
                    .orElseThrow(() -> new RuntimeException("Score not found"));
            return mapper(response);
        } catch (Exception e) {
            log.error("Error in getScore method");
            throw e;
        }
    }

    // get all
    public List<ScoreResponse> getScores() {
        try  {
            log.info("Inside getScores method");
            return scoreRepo.findAll()
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e)  {
            log.error("Error in getScores method");
            throw e;
        }
    }

    // update
    public ScoreResponse updateScore(Long scoreId, ScoreRequest request) {
        try {
            log.info("Inside updateScore method");
            Score response = scoreRepo.findById(scoreId)
                    .orElseThrow(() -> new RuntimeException("Score not found"));

            if (request.getScore() != null) {
                response.setStudentScore(request.getScore());
            }
            if (request.getAssessmentId() != null) {
                Assessment assessment = assessmentRepo.findById(request.getAssessmentId())
                        .orElseThrow(() -> new RuntimeException("Assessment not found"));
                response.setAssessment(assessment);
            }
            if (request.getStudentId() != null) {
                Student student = studentRepo.findById(request.getStudentId())
                        .orElseThrow(() -> new RuntimeException("Student not found"));
                response.setStudent(student);
            }
            if (request.getClassSubjectId() != null) {
                ClassSubject classSubject = classSubjectRepo.findById(request.getClassSubjectId())
                        .orElseThrow(() -> new RuntimeException("ClassSubject not found"));
                response.setClassSubject(classSubject);
            }

            final Score savedScore = scoreRepo.save(response);
            log.info("Score updated successfully");
            return mapper(savedScore);
        } catch (Exception e) {
            log.error("Error in updateScore method");
            throw e;
        }
    }

    // delete
    public void deleteScore(Long scoreId) {
        try {
            log.info("Inside deleteScore method");
            scoreRepo.deleteById(scoreId);
        }
        catch (Exception e) {
            log.error("Error in deleteScore method");
            throw e;
        }
    }

    public Double getAverageClassSubjectScore(Long classSubjectId) {
        try {
            log.info("Inside getAverageClassSubjectScore method");
            ClassSubject classSubject = classSubjectRepo.findById(classSubjectId)
                    .orElseThrow(() -> new RuntimeException("ClassSubject not found"));
            return scoreRepo.getAverageScoreForClasssubject(classSubject);
        } catch (Exception e) {
            log.error("Error in getAverageClassSubjectScore method");
            throw e;
        }
    }
}
