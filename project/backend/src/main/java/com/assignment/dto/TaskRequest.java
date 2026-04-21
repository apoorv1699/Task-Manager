package com.assignment.dto;

import jakarta.validation.constraints.NotBlank;

public class TaskRequest {
    @NotBlank(message = "Title is required")
    private String title;
    
    private String description;
    private String status = "PENDING";

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
