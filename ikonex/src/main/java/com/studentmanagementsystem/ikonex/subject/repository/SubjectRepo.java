package com.studentmanagementsystem.ikonex.subject.repository;

import com.studentmanagementsystem.ikonex.subject.model.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubjectRepo extends JpaRepository<Subject,Long> {
}
