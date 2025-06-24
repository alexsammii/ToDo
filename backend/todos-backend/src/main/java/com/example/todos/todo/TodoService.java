package com.example.todos.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@Service
public class TodoService {

    @Autowired
    private TodoRepository todoRepository;

    public List<Todo> getAll() {
    return todoRepository.findAll();
}

    public Page<Todo> getByArchivedAndCompleted(boolean archived, boolean completed, Pageable pageable) {
    return todoRepository.findByArchivedAndCompleted(archived, completed, pageable);
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

//     public Todo toggleComplete(Long id, Todo updatedTodo) {
//     Todo existing = todoRepository.findById(id).orElseThrow();

//     existing.setCompleted(updatedTodo.completed());
    
//     existing.setTask(updatedTodo.getTask());
//     existing.setDueDate(updatedTodo.getDueDate());
//     existing.setTime(updatedTodo.getTime());
//     existing.setAllDay(updatedTodo.isAllDay());
//     existing.setArchived(updatedTodo.archived());
//     existing.setCategory(updatedTodo.getCategory());

//     return todoRepository.save(existing);
// }

public Todo toggleComplete(Long id, boolean completed) {
    Todo todo = todoRepository.findById(id).orElseThrow();
    todo.setCompleted(completed);
    return todoRepository.save(todo);
}

}
