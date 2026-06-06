package com.studentmanagementsystem.ikonex.classStream.repository;

import com.studentmanagementsystem.ikonex.classStream.model.ClassStream;
import com.studentmanagementsystem.ikonex.student.model.Student;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassStreamRepo extends JpaRepository<ClassStream, Long> {
}
