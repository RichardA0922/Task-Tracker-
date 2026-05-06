package com.Project.Task.domain.dto;

import com.Project.Task.domain.entity.TaskPriority;
import com.Project.Task.domain.entity.TaskStatus;

import java.time.LocalDate;
import java.util.UUID;
// No annotations. These are being returned not requested
public record TaskDto(
        UUID id,
        String title,
        String description,
        LocalDate dueDate,
        TaskPriority taskPriority,
        TaskStatus status
) {
}
