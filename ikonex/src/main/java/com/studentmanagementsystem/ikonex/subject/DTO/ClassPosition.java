package com.studentmanagementsystem.ikonex.subject.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClassPosition {
    private String classStreamName;
    private Integer totalStudents;
    private Double classTotal;
    private Double classAverage;
    private Integer classPosition;

    /*
    {
        classStreamName: "Form 1A',;
        classTotal: 9980.00,
        totalStudents: 148;
        classAverage: 67,
        classPosition: 3
    }
     */
}
