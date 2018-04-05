package todosWebApp.persistence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import todosWebApp.persistence.creators.TaskDataCreator;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.queries.TaskDataQuery;
import todosWebApp.persistence.repository.CategoryRepository;
import todosWebApp.persistence.repository.TaskRepository;

import java.sql.Date;
import java.util.List;

@Component
@Transactional
public class TaskService implements TaskDataQuery, TaskDataCreator {


    @Autowired
    private TaskRepository taskRepository;

    @Autowired
    private CategoryRepository categoryRepository;

    public TaskService(){
    }

    @Override
    public List<Task> findByTitle(String title) {
        return taskRepository.findByTitle(title);
    }

    @Override
    public List<Task> getAllTasks() {
        return taskRepository.getAllTasks();
    }

    @Override
    public Task getTaskById(Long taskId) {
        return taskRepository.getTaskById(taskId);
    }

    @Override
    public List<Task> getTasksByCategory(Long categoryId) {
        return taskRepository.getTasksByCategory(categoryId);
    }

    @Override
    public Task createTask(String name) {
        return createTask(name, null, categoryRepository.getRootCategory());
    }

    @Override
    public Task createTask(String name, Date date) {
        return createTask(name, date, categoryRepository.getRootCategory());
    }

    @Override
    public Task createTask(String name, Date date, Category category) {
        Task task = new Task(name, date);
        setTaskCategoryRelation(task, category);
        taskRepository.save(task);
        categoryRepository.save(category);

        return task;
    }

    @Override
    public Task createTask(String name, Category category) {
        return createTask(name, null, category);
    }

    @Override
    public void deleteTask(Long taskId) {
        deleteTask(getTaskById(taskId));
    }

    @Override
    public void deleteTask(Task task) {
        if(task.getCategory() != null)
            unsetRelation(task, task.getCategory());
        taskRepository.delete(task);
    }

    private void unsetRelation(Task task, Category category) {
        task.setCategory(null);
        category.removeTask(task);
        taskRepository.save(task);
        categoryRepository.save(category);
    }

    @Override
    public void assignDate(Long taskId, Date date) {
        Task task = getTaskById(taskId);
        task.setDate(date);
        taskRepository.save(task);
    }

    @Override
    public void assignCategory(Long taskId, Long categoryId) {
        Task task = getTaskById(taskId);
        Category category = categoryRepository.getCategoryById(categoryId);
        if(task.getCategory() != null)
            unsetRelation(task, task.getCategory());
        setTaskCategoryRelation(task, category);
        taskRepository.save(task);
        categoryRepository.save(category);
    }

    @Override
    public void setDone(Long taskId) {
        Task task = getTaskById(taskId);
        task.setDone(true);
        taskRepository.save(task);
    }

    private void setTaskCategoryRelation(Task task, Category category){
        if(task.getCategory() != null) {
            task.getCategory().removeTask(task);
            task.setCategory(null);
            categoryRepository.save(task.getCategory());
        }
        task.setCategory(category);
        category.addTask(task);
    }
}
