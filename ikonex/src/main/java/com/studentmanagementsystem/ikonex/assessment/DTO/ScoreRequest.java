package com.studentmanagementsystem.ikonex.assessment.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Builder
@Data
@AllArgsConstructor
@NoArgsConstructor
public class ScoreRequest {
    private Long studentId;
    private Long assessmentId;
    private Double score;
    private Long classSubjectId;
}
