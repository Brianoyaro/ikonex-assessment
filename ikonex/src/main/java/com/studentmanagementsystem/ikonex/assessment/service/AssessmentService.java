package com.studentmanagementsystem.ikonex.assessment.service;

import com.studentmanagementsystem.ikonex.assessment.DTO.AssessmentRequest;
import com.studentmanagementsystem.ikonex.assessment.DTO.AssessmentResponse;
import com.studentmanagementsystem.ikonex.assessment.enums.AssessmentType;
import com.studentmanagementsystem.ikonex.assessment.enums.Term;
import com.studentmanagementsystem.ikonex.assessment.model.Assessment;
import com.studentmanagementsystem.ikonex.assessment.repository.AssessmentRepo;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class AssessmentService {
    private final AssessmentRepo assessmentRepo;

    // Create
    @Transactional
    public AssessmentResponse createAssessment(AssessmentRequest request) {
        try {
            log.debug("Creating assessment request");
            Assessment assessment = Assessment.builder()
                    .assessmentName(request.getAssessmentName())
                    .assessmentType(AssessmentType.valueOf(request.getAssessmentType()))
                    .totalScore(request.getAssessmentTotal())
                    .term(Term.valueOf(request.getTerm()))
                    .year(request.getYear())
                    .build();
            final Assessment savedAssessment = assessmentRepo.save(assessment);
            return mapper(savedAssessment);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // mapper
    private AssessmentResponse mapper(Assessment assessment) {
        return AssessmentResponse.builder()
                .assessmentId(assessment.getId())
                .assessmentTotal(assessment.getTotalScore())
                .assessmentName(assessment.getAssessmentName())
                .assessmentType(String.valueOf(assessment.getAssessmentType()))
                .term(String.valueOf(assessment.getTerm()))
                .year(assessment.getYear())
                .build();
    }

    // Get One
    public AssessmentResponse getAssessment(Long id) {
        try {
            log.debug("Get assessment by id {}", id);
            Assessment assessment = assessmentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Assessment with id " + id + " not found"));
            return mapper(assessment);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Get All
    public List<AssessmentResponse> getAllAssessments() {
        try {
            log.debug("Get all Assessments");
            return assessmentRepo.findAll()
                    .stream()
                    .map(this::mapper)
                    .collect(Collectors.toList());
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Update
    @Transactional
    public AssessmentResponse updateAssessment(Long id, AssessmentRequest assessmentRequest) {
        try {
            log.debug("Updating assessment with id {}", id);
            Assessment assessment = assessmentRepo.findById(id)
                    .orElseThrow(() -> new RuntimeException("Assessment with id " + id + " not found"));

            if (assessmentRequest.getAssessmentName() != null && !assessment.getAssessmentName().equals(assessmentRequest.getAssessmentName())) {
                assessment.setAssessmentName(assessmentRequest.getAssessmentName());
            }
            if (assessmentRequest.getTerm() != null) {
                assessment.setTerm(Term.valueOf(assessmentRequest.getTerm()));
            }
            if (assessmentRequest.getYear() != null) {
                assessment.setYear(assessmentRequest.getYear());
            }
            if (assessmentRequest.getAssessmentType() != null) {
                assessment.setAssessmentType(AssessmentType.valueOf(assessmentRequest.getAssessmentType()));
            }
            if  (assessmentRequest.getAssessmentTotal() != null) {
                assessment.setTotalScore(assessmentRequest.getAssessmentTotal());
            }

            Assessment savedAssessment = assessmentRepo.save(assessment);
            return mapper(savedAssessment);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }

    // Delete
    @Transactional
    public void deleteAssessment(Long id) {
        try {
            log.debug("Deleting assessment with id {}", id);
            assessmentRepo.deleteById(id);
        } catch (Exception e) {
            log.error(e.getMessage());
            throw e;
        }
    }
}
