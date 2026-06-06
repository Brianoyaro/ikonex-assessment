package com.studentmanagementsystem.ikonex.classStream.DTO;

import com.studentmanagementsystem.ikonex.student.DTO.StudentResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStreamStudentResult extends StudentResult {
    private Integer studentPosition;
}
