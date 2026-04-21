package com.assignment.controllers;

import com.assignment.dto.TaskRequest;
import com.assignment.dto.TaskResponse;
import com.assignment.models.Role;
import com.assignment.models.Task;
import com.assignment.models.User;
import com.assignment.repositories.TaskRepository;
import com.assignment.repositories.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/tasks")
public class TaskController {

    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private UserRepository userRepository;

    private User getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserDetails) {
            String email = ((UserDetails) auth.getPrincipal()).getUsername();
            return userRepository.findByEmail(email).orElse(null);
        }
        return null;
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getAllTasks() {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        List<Task> tasks;
        if (user.getRole() == Role.ADMIN) {
            tasks = taskRepository.findAll();
        } else {
            tasks = taskRepository.findByUser(user);
        }

        List<TaskResponse> response = tasks.stream().map(TaskResponse::new).collect(Collectors.toList());
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<TaskResponse> createTask(@Valid @RequestBody TaskRequest request) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Task task = new Task(request.getTitle(), request.getDescription(), request.getStatus(), user);
        taskRepository.save(task);

        return ResponseEntity.status(HttpStatus.CREATED).body(new TaskResponse(task));
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateTask(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

        if (user.getRole() != Role.ADMIN && !task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to update this task");
        }

        task.setTitle(request.getTitle());
        task.setDescription(request.getDescription());
        task.setStatus(request.getStatus());

        taskRepository.save(task);
        return ResponseEntity.ok(new TaskResponse(task));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable Long id) {
        User user = getCurrentUser();
        if (user == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();

        Task task = taskRepository.findById(id).orElse(null);
        if (task == null) return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Task not found");

        if (user.getRole() != Role.ADMIN && !task.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Not authorized to delete this task");
        }

        taskRepository.delete(task);
        return ResponseEntity.ok("Task deleted successfully");
    }
}
