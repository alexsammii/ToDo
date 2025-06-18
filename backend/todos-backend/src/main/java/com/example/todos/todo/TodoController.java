package com.example.todos.todo;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

}
