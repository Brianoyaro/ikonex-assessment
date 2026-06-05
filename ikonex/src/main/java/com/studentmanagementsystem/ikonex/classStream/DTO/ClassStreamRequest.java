package com.studentmanagementsystem.ikonex.classStream.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStreamRequest {
    private String name;
    private Integer level;
    private String description;
}
