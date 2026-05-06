package com.Project.Task.service.impl;

import com.Project.Task.domain.CreateTaskRequest;
import com.Project.Task.domain.UpdateTaskRequest;
import com.Project.Task.domain.entity.Task;
import com.Project.Task.domain.entity.TaskStatus;
import com.Project.Task.exception.TaskNotFoundException;
import com.Project.Task.repository.TaskRepository;
import com.Project.Task.service.TaskService;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class TaskServiceimpl implements TaskService {

        private final TaskRepository taskRepository;
            // constructor to communicate with the repository
        public TaskServiceimpl(TaskRepository taskRepository){
            this.taskRepository = taskRepository;
        }
    // CreateTaskRequest is stored in request to get all the necessary information to create a task
    @Override
    public Task createTask(CreateTaskRequest request) {
        Instant now = Instant.now();

        Task task = new Task(
                null,
                request.title(),
                request.description(),
                request.dueDate(),
                TaskStatus.OPEN,
                request.priority(),
                now,
                now
        );
        // will save the task in the database
        return taskRepository.save(task);
    }
    //Method to list the tasks on the web page
    @Override
    public List<Task> listTasks() {
        return taskRepository.findAll(Sort.by(Sort.Direction.ASC, "created" ));
    }

    @Override
    public Task updateTask(UUID taskId, UpdateTaskRequest request) {
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException(taskId));


        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setStatus(request.status());
        task.setPriority(request.priority());
        task.setUpdated(Instant.now());


        return taskRepository.save(task);

    }

    @Override
    public void deleteTask(UUID taskId) {
        taskRepository.deleteById(taskId);
    }

}
