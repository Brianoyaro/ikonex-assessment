package com.studentmanagementsystem.ikonex.subject.repository;

import com.studentmanagementsystem.ikonex.subject.model.ClassSubject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassSubjectRepo extends JpaRepository<ClassSubject, Long> {
    List<ClassSubject> findByClassStreamId(Long classId);

    Optional<ClassSubject> findBySubjectId(Long subjectId);
}
