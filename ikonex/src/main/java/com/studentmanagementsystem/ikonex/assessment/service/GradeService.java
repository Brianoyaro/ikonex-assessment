package com.studentmanagementsystem.ikonex.assessment.service;

import com.studentmanagementsystem.ikonex.assessment.enums.Grade;
import org.springframework.stereotype.Service;

@Service
public class GradeService {

    public Grade calculateGrade(Double score, Double maxScore) {
        if (score == null || maxScore == null || maxScore == 0) {
            return Grade.F;
        }

        // Convert to percentage
        Double percentage = (score / maxScore) * 100;
        return Grade.fromScore(percentage);
    }

    public Grade calculateGradeFromPercentage(Double percentage) {
        return Grade.fromScore(percentage);
    }

    public String getGradeWithDescription(Double score, Double maxScore) {
        Grade grade = calculateGrade(score, maxScore);
        return grade.name() + " - " + grade.getDescription();
    }
}
