package com.studentmanagementsystem.ikonex.subject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.Year;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AssessmentScore {
    private String assessmentName;
    private Double studentScore;
    private String assessmentTerm;
    private Year assessmentYear;
}