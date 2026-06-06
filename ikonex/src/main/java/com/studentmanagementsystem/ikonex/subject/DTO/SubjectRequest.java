package com.studentmanagementsystem.ikonex.subject.DTO;

import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class SubjectRequest {
    @NotBlank(message = "Subject name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotBlank(message = "Subject code is required")
    private String code;
}
