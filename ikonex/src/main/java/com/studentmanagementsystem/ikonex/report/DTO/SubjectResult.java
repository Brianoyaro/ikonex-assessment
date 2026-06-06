package com.studentmanagementsystem.ikonex.report.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Builder
@NoArgsConstructor
@AllArgsConstructor
@Data
public class SubjectResult {
       private Long subjectId;

        private String subjectName;

        private List<AssessmentScore> scores;

        private Double total;

        private Double average;

        private String grade;

        //private Integer subjectPosition;
}
