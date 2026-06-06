package com.studentmanagementsystem.ikonex.student.DTO;

import com.studentmanagementsystem.ikonex.subject.DTO.SubjectResult;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StudentResult {
    private Long studentId;
    private String admissionNumber;
    private String studentName;
    private String classStream;
    private List<SubjectResult> subjects;
    private Double overallTotal;
    private Double overallAverage;
//    private Integer position;


    /*
    e.g
        {
          "studentId": 1,
          "studentAdmissionNumber": "123",
          "studentName": "Brian Mokua",
          "classStream": "Form 1A",
          "subjects": [
            {
              "subjectId": 1,
              "subjectName": "Mathematics",
              "scores": [
                {
                  "assessment": "CAT 1",
                  "term": "Term 1",
                  "year": 2020,
                  "score": 20
                },
                {
                  "assessment": "CAT 2",
                  "term": "Term 1",
                  "year": 2020,
                  "score": 15
                },
                {
                  "assessment": "Exam",
                  "term": "Term 1",
                  "year": 2020,
                  "score": 55
                }
              ],
              "total": 90,
              "average": 30,
              "grade": "A"
            }
          ],
          "overallTotal": 560,
          "overallAverage": 80,
//          "position": 1
        }
     */
}