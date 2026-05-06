package com.Project.Task.domain;

import com.Project.Task.domain.entity.TaskPriority;
import com.Project.Task.domain.entity.TaskStatus;

import java.time.LocalDate;

public record UpdateTaskRequest(
        String title,
        String description,
        LocalDate dueDate,
        TaskStatus status,
        TaskPriority priority
) {
}

