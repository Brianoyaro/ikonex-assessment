package com.studentmanagementsystem.ikonex.subject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SubjectPosition {
    private String classStreamName;
    private String subjectName;
    private Double classSubjectTotal;
    private Double classSubjectAverage;
    private Integer classSubjectPosition;

    /*
    [
        {
            classStreamName: "Form 1A",
            subjectName: "Maths",
            classSubjectTotal: 1800,
            classSubjectAverage: 89,
            classSubjectPosition: 8
        },
        {...}
    ]
     */
}
