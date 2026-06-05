package com.studentmanagementsystem.ikonex.subject.DTO;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubjectRequest {
    private String name;
    private String description;
    private String code;
}
