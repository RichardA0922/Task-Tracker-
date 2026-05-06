package com.Project.Task.domain;

import com.Project.Task.domain.entity.TaskPriority;

import java.time.LocalDate;

public record CreateTaskRequest(
    String title,
    String description,
    LocalDate dueDate,
    TaskPriority priority
)
{

}
