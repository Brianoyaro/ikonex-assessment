package com.studentmanagementsystem.ikonex.classStream.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClassStreamStudentObject {
    private Long id;
    private String admissionNumber;
    private String firstName;
    private String lastName;
    private String gender;
    private String status;
    private LocalDate dateOfBirth;
}
