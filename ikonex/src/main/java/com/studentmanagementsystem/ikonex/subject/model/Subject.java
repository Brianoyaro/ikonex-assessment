package com.studentmanagementsystem.ikonex.subject.model;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.Slf4j;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Slf4j
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 100, nullable = false)
    private String name;

    @Column(nullable = false)
    private String code;

    @Column(nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDateTime createdAt;


    @OneToOne(mappedBy ="subject", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Score> studentScores = new ArrayList<>();

    @OneToMany(mappedBy = "subject")
    private List<ClassSubject> classSubjects; // I do not see a need for returning this in the response object

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
