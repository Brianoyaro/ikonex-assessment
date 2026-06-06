package com.studentmanagementsystem.ikonex.classStream.model;

import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@ToString(exclude = "studentList")
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ClassStream {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @OneToMany(mappedBy = "classStream", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @Builder.Default
    private List<Student> studentList =  new ArrayList<>();

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer formLevel;

    @Column(nullable = false)
    private String description;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;


    @OneToMany(mappedBy = "classStream")
    private List<ClassSubject> classSubjects;

    // created_at pre-persist
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
