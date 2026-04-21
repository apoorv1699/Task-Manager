package com.assignment.dto;

import com.assignment.models.Task;

public class TaskResponse {
    private Long id;
    private String title;
    private String description;
    private String status;
    private String ownerName;

    public TaskResponse(Task task) {
        this.id = task.getId();
        this.title = task.getTitle();
        this.description = task.getDescription();
        this.status = task.getStatus();
        this.ownerName = task.getUser().getName();
    }

    public Long getId() { return id; }
    public String getTitle() { return title; }
    public String getDescription() { return description; }
    public String getStatus() { return status; }
    public String getOwnerName() { return ownerName; }
}
