package com.studentmanagementsystem.ikonex.classStream.DTO;

import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStreamResponse {
    private Long id;
    private String name;
    private Integer level;
    private String description;
    private LocalDateTime createdAt;
    private List<Student> studentList;

    private List<ClassSubject> classSubjectList;
}
