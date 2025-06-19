package com.example.todos.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAll() {
    return todoRepository.findAll();
}

    public List<Todo> getByCategoryId(Long categoryId) {
        return todoRepository.findByCategoryId(categoryId);
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
}
