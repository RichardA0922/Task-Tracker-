package com.Project.Task.mapper;

import com.Project.Task.domain.CreateTaskRequest;
import com.Project.Task.domain.UpdateTaskRequest;
import com.Project.Task.domain.dto.CreateTaskRequestDto;
import com.Project.Task.domain.dto.TaskDto;
import com.Project.Task.domain.dto.UpdateTaskRequestDto;
import com.Project.Task.domain.entity.Task;

public interface TaskMapper {
        //Method to Map the dto to a CreateTaskRequest
    CreateTaskRequest fromDto(CreateTaskRequestDto dto);


    UpdateTaskRequest fromDto(UpdateTaskRequestDto dto);

        // Method to map a Task entity to a Task Dto
    TaskDto toDto(Task task);


}
