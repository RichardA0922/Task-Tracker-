package com.Project.Task.service;

import com.Project.Task.domain.CreateTaskRequest;
import com.Project.Task.domain.UpdateTaskRequest;
import com.Project.Task.domain.entity.Task;

import java.util.List;
import java.util.UUID;

public interface TaskService {

     Task createTask(CreateTaskRequest request);

     List<Task> listTasks();

     Task updateTask(UUID taskId, UpdateTaskRequest request);


     void deleteTask(UUID taskId);

}
