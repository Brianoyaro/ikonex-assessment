package com.studentmanagementsystem.ikonex.assessment.model;

import com.studentmanagementsystem.ikonex.student.model.Student;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "student_id",
                                "class_subject_id",
                                "assessment_id"
                        }
                )
        }
)
public class Score {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Builder.Default
    @Column(nullable = false)
    private Double studentScore = 0.0;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private Student student;

    @ManyToOne
    @JoinColumn(name = "class_subject_id")
    private ClassSubject classSubject;

    @ManyToOne
    @JoinColumn(name = "assessment_id")
    private Assessment assessment;

//    private String studentId | subjectID | assesmentId;
}
