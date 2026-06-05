package com.studentmanagementsystem.ikonex.subject.DTO;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import lombok.*;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SubjectResponse {
    private Long id;
    private String name;
    private String description;
    private String code;
    private LocalDateTime createdAt;

    private List<Score> studentScores;
}
