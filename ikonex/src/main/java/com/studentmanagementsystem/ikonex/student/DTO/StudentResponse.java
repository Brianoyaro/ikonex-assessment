package com.studentmanagementsystem.ikonex.student.DTO;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResponse {
    private Long id;
    private String admissionNumber;
    private String firstName;
    private String lastName;
    private String gender;
    private String status;
    private LocalDate dateOfBirth;
    private String classStreamName;
    private LocalDate createdAt;

    private List<Score> assessmentScores;
}
