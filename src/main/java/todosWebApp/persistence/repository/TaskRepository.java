package todosWebApp.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.queries.TaskDataQuery;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer>, TaskDataQuery {

    @Override
    @Query("select task from Task task where task.title = :title")
    List<Task> getTaskByTitle(@Param("title") String title);

    @Override
    @Query("select task from Task task")
    List<Task> getAllTasks();

    @Override
    @Query("select task from Task task where task.id = :taskId")
    Task getTaskById(@Param("taskId") Long taskId);

    @Override
    @Query("select task from Task task where task.category.id = :categoryId")
    List<Task> getTasksByCategory(@Param("categoryId") Long categoryId);

    @Override
    @Query("select task from Task task where (not task.date = null) and task.date >= :startDate and task.date < :endDate ")
    List<Task> getTasksFromInterval(@Param("startDate") Long startDate, @Param("endDate") Long endDate);

    @Query("select task from Task task where task.date = null and task.done = false")
    List<Task> getUnassignedTasks();

    @Override
    @Query("select task from Task task where task.done = false and task.child.done = true")
    Task getLastUncheckedTask();

}
