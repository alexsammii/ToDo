package com.example.todos.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequestMapping("/todos")
public class TodoController {

    @Autowired
    private TodoService todoService;

    @GetMapping
    public List<Todo> getAll() {
        return todoService.getAll();
    }

@GetMapping("/filter")
public Page<Todo> getFilteredTodos(
    @RequestParam(defaultValue = "false") boolean archived,
    @RequestParam(defaultValue = "false") boolean completed,
    Pageable pageable
) {
    System.out.println("FILTERING - archived: " + archived + ", completed: " + completed);
    return todoService.getByArchivedAndCompleted(archived, completed, pageable);
}

    @GetMapping("/filter/category")
    public Page<Todo> getByCategory(
    @RequestParam Long categoryId,
    Pageable pageable
) {
    return todoService.getByCategoryId(categoryId, pageable);
}


    @PostMapping
    public Todo create(@RequestBody Todo todo) {
        return todoService.create(todo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Todo> update(@PathVariable Long id, @RequestBody Todo updatedTodo) {
    Todo result = todoService.update(id, updatedTodo);
    return ResponseEntity.ok(result);
}

   @PatchMapping("/{id}/archive")
    public ResponseEntity<String> archive(@PathVariable Long id) {
    todoService.softDelete(id);
    return ResponseEntity.ok("Todo with ID " + id + " has been archived.");
}

@PatchMapping("/{id}/complete")
public ResponseEntity<Todo> toggleComplete(@PathVariable Long id, @RequestBody Map<String, Boolean> body) {
    if (!body.containsKey("completed")) {
        return ResponseEntity.badRequest().build();
    }

    boolean completed = body.get("completed");
    Todo updated = todoService.toggleComplete(id, completed);
    return ResponseEntity.ok(updated);
}


}
