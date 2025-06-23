package com.example.todos.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAll() {
    return todoRepository.findAll();
}

public Page<Todo> getByCategoryId(Long categoryId, Pageable pageable) {
    return todoRepository.findByCategoryId(categoryId, pageable);
}

    public Todo create(Todo todo) {
        return todoRepository.save(todo);
    }

    public Todo update(Long id, Todo updatedTodo) {
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.setTask(updatedTodo.getTask());
        todo.setDueDate(updatedTodo.getDueDate());
        todo.setTime(updatedTodo.getTime()); 
        todo.setAllDay(updatedTodo.isAllDay()); 
        todo.setCompleted(updatedTodo.isCompleted());
        todo.setArchived(updatedTodo.isArchived());
        todo.setCategory(updatedTodo.getCategory());
        return todoRepository.save(todo);
    }

    public void softDelete(Long id) {
        System.out.println("Archiving todo with ID: " + id);
        Todo todo = todoRepository.findById(id).orElseThrow();
        todo.setArchived(true);
        todoRepository.save(todo);
    }

    public Page<Todo> getFilteredTodos(Boolean archived, Boolean completed, Pageable pageable) {
    if (archived != null && completed != null) {
        return todoRepository.findByIsArchivedAndIsCompleted(archived, completed, pageable);
    } else if (archived != null) {
        return todoRepository.findByIsArchived(archived, pageable);
    } else if (completed != null) {
        return todoRepository.findByIsCompleted(completed, pageable);
    } else {
        return todoRepository.findAll(pageable);
    }
}
}
