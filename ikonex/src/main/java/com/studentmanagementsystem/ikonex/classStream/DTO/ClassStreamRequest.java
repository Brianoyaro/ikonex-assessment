package com.studentmanagementsystem.ikonex.classStream.DTO;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStreamRequest {
    @NotBlank(message = "Class stream name is required")
    private String name;

    @NotNull(message = "Form level is required")
    @Min(value = 1, message = "Form level must be at least 1")
    private Integer level;

    @NotBlank(message = "Description is required")
    private String description;
}
