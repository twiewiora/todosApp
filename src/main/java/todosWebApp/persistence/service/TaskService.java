package todosWebApp.persistence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.repository.TaskRepository;

import java.util.List;

@Component
@Transactional
public class TaskService {

    @Autowired
    private TaskRepository taskRepository;

    public TaskService(){
    }

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    public void addTask(Task task) {
        taskRepository.save(task);
    }

    public List<Task> getAll() {
        return taskRepository.findAll();
    }

    public List<Task> findByTitle(String title){
        return taskRepository.findByTitle(title);
    }
}
