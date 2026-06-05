package com.studentmanagementsystem.ikonex.student.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class StudentRequest {
    private String admissionNumber;
    private String firstName;
    private String lastName;
    private String gender;
    private String status;
    private LocalDate dateOfBirth;
    private Long classStreamId;

}
