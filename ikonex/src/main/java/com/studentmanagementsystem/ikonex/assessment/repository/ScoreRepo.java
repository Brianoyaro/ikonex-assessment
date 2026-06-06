package com.studentmanagementsystem.ikonex.assessment.repository;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ScoreRepo extends JpaRepository<Score, Long> {
    //public Double getAverageScoreForClasssubject(ClassSubject classSubject);
}
