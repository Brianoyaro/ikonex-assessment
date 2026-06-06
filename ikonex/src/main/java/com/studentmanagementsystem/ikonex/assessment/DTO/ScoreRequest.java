package com.studentmanagementsystem.ikonex.assessment.DTO;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreRequest {
    @NotNull(message = "Student ID is required")
    private Long studentId;

    @NotNull(message = "Assessment ID is required")
    private Long assessmentId;

    @NotNull(message = "Score is required")
    @Min(value = 0, message = "Score cannot be negative")
    private Double score;

    @NotNull(message = "Class subject ID is required")
    private Long classSubjectId;
}
