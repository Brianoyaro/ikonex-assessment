package com.studentmanagementsystem.ikonex.student.repository;

import com.studentmanagementsystem.ikonex.assessment.model.Score;
import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
}
