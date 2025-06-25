package com.example.todos.todo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TodoRepository extends JpaRepository<Todo, Long> {
    Page<Todo> findByArchivedAndCompleted(boolean archived, boolean completed, Pageable pageable);

    Page<Todo> findByCategoryId(Long categoryId, Pageable pageable);

}
