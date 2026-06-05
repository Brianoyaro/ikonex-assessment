package com.studentmanagementsystem.ikonex.assessment.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentResponse {
    private Long assessmentId;
    private String assessmentName;
    private String assessmentType;
    private Double assessmentTotal;
    private String term;
    private LocalDate year;
}
