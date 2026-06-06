package com.studentmanagementsystem.ikonex.assessment.DTO;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScoreResponse {
    private String assessment;
    private String subjectName;
    private Double score;
    private String studentAdmissionNumber;
    private String className;
    private String grade;
    private Double maxScore;

    /*
    e.g
    {
        assessment: "CAT1_TERM2_2026", -> [ "{}_{}_{}".format(score.assessment.getname(), score.assessment.getterm(), score.assessment.getyear()) ]//This will be the tricky part. I will have to implement it in the mapper method in the service class
        subjectName: "Mathematics", -> classsubject.subject.getname()
        score: 87.00,
        studentAdmissionNumber: 97865,
        className: "Form1" ->classsubject.classstream.getname()
    }
     */
}
