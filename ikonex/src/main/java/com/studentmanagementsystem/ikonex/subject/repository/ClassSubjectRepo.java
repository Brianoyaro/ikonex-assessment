package com.studentmanagementsystem.ikonex.subject.repository;

import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClassSubjectRepo extends JpaRepository<ClassSubject, Long> {
    List<ClassSubject> findByClassId(Long classId);
}
