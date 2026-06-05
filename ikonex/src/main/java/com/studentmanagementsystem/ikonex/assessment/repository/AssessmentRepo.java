package com.studentmanagementsystem.ikonex.assessment.repository;

import com.studentmanagementsystem.ikonex.assessment.model.Assessment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AssessmentRepo extends JpaRepository<Assessment, Long> {
}
