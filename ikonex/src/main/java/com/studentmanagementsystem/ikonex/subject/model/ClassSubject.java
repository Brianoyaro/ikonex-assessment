package com.studentmanagementsystem.ikonex.subject.model;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Table(
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {
                                "class_stream_id",
                                "subject_id"
                        }
                )
        }
)
public class ClassSubject {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "class_stream_id")
    private ClassStream classStream;

    @ManyToOne
    @JoinColumn(name = "subject_id")
    private Subject subject;

    @OneToMany(mappedBy ="classSubject", cascade = CascadeType.ALL)
    @Builder.Default
    private List<Score> studentScores = new ArrayList<>();
}
