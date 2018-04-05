package todosWebApp.persistence.service;

import org.springframework.data.repository.query.Param;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;

import java.sql.Date;
import java.util.List;

public interface TaskDatabase {

   List<Task> findByTitle(String title);

   List<Task> getAllTasks();

   Task getTaskById(Long taskId);

   List<Task> getTasksByCategory(Long categoryId);

   void createTask(String name);
   
   void createTask(Task task);
    
   void createTask(String name, Date date);

   void createTask(String name, Date date, Category category);

   void createTask(String name, Category category);

   void deleteTask(Long taskId);

   void deleteTask(Task task);

   void assingDate(Long taskId, Date date);

   void assignCategory(Long taskId, Long categoryId);
   
}
