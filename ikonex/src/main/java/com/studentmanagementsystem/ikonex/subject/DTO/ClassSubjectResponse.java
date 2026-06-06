package com.studentmanagementsystem.ikonex.subject.DTO;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassSubjectResponse {
    private Long id;
    private String name;

    private String className;

    private String description;
    private String code;
    private LocalDateTime createdAt;
    private List<Score> studentScores;
}
