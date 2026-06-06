package com.studentmanagementsystem.ikonex.assessment.enums;

import lombok.Getter;

@Getter
public enum Grade {
    A(80, 100, "Excellent"),
    B(70, 79, "Very Good"),
    C(60, 69, "Good"),
    D(50, 59, "Satisfactory"),
    E(40, 49, "Poor"),
    F(0, 39, "Fail");

    private final int minScore;
    private final int maxScore;
    private final String description;

    Grade(int minScore, int maxScore, String description) {
        this.minScore = minScore;
        this.maxScore = maxScore;
        this.description = description;
    }

    public static Grade fromScore(Double score) {
        if (score == null || score < 0) {
            return F;
        }

        int scoreInt = score.intValue();

        for (Grade grade : Grade.values()) {
            if (scoreInt >= grade.minScore && scoreInt <= grade.maxScore) {
                return grade;
            }
        }

        return F;
    }

}
