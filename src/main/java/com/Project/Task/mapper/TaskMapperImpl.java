package com.Project.Task.mapper;


import com.Project.Task.domain.CreateTaskRequest;
import com.Project.Task.domain.UpdateTaskRequest;
import com.Project.Task.domain.dto.CreateTaskRequestDto;
import com.Project.Task.domain.dto.TaskDto;
import com.Project.Task.domain.dto.UpdateTaskRequestDto;
import com.Project.Task.domain.entity.Task;
import org.springframework.stereotype.Component;


@Component
public class TaskMapperImpl implements TaskMapper {

    //Map to CreateRequestDto
    @Override
    public CreateTaskRequest fromDto(CreateTaskRequestDto dto) {
         return new CreateTaskRequest(
                 dto.title(),
                 dto.description(),
                 dto.dueDate(),
                 dto.priority()
         );
    }

    @Override
    public UpdateTaskRequest fromDto(UpdateTaskRequestDto dto) {
        return new UpdateTaskRequest(
                dto.title(),
                dto.description(),
                dto.dueDate(),
                dto.status(),
                dto.priority()
        );
    }

    // map to TaskDto
    @Override
    public TaskDto toDto(Task task) {
        return new TaskDto(
            task.getId(),
            task.getTitle(),
            task.getDescription(),
            task.getDueDate(),
            task.getPriority(),
            task.getStatus()
        );
    }
}

