package todosWebApp.persistence.creators;

import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;


public interface TaskDataCreator {

   Task createTask(String name);
    
   Task createTask(String name, Long date);

   Task createTask(String name, Long date, Category category);

   Task createTask(String name, Category category);

   void deleteTask(Long taskId);

   void deleteTask(Task task);

   void assignDate(Long taskId, Long date);

   void unassignDate(Long taskId);

   void assignCategory(Long taskId, Long categoryId);

   void moveTask(Long taskId, Long newParentTaskId);

   void setDone(Long taskId, boolean isDone);
   
}
