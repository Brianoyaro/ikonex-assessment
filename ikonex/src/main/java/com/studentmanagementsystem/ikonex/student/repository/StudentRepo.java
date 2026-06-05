package com.studentmanagementsystem.ikonex.student.repository;

import com.studentmanagementsystem.ikonex.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StudentRepo extends JpaRepository<Student, Long> {
}
