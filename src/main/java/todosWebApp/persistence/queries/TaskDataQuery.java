package todosWebApp.persistence.queries;

import todosWebApp.persistence.model.Task;

import java.util.List;

public interface TaskDataQuery {

    List<Task> getTaskByTitle(String title);

    List<Task> getAllTasks();

    Task getTaskById(Long taskId);

    List<Task> getTasksByCategory(Long categoryId);

    List<Task> getUnassignedTasks();

    Task getLastUncheckedTask();

}
