package com.studentmanagementsystem.ikonex.assessment.model;

import com.studentmanagementsystem.ikonex.assessment.enums.AssessmentType;
import com.studentmanagementsystem.ikonex.assessment.enums.Term;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Assessment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String assessmentName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private AssessmentType assessmentType;

    @Column(nullable = false)
    private Double totalScore;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Term term;

    @Column(nullable = false)
    private LocalDate year;

    @OneToMany(mappedBy = "assessment", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Score> assessmentScores =  new ArrayList<>();
}
