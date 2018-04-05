package todosWebApp.persistence.creators;

import org.springframework.data.repository.query.Param;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;

import java.sql.Date;
import java.util.List;

public interface TaskDataCreator {

   Task createTask(String name);
    
   Task createTask(String name, Date date);

   Task createTask(String name, Date date, Category category);

   Task createTask(String name, Category category);

   void deleteTask(Long taskId);

   void deleteTask(Task task);

   void assignDate(Long taskId, Date date);

   void assignCategory(Long taskId, Long categoryId);

   void setDone(Long taskId);
   
}
