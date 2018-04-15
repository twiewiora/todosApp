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

import java.util.ArrayList;
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
    public void moveTask(Long taskId, Long newParentTaskId) {
        // TODO implement moving task
        // the task should be moved one position below newParentTaskId while newParentTasId shouldn't be moved at all
        // if newParentTaskId is null then the task should be moved on top of the line
    }

    @Override
    public List<Task> getTaskByTitle(String title) {
        return taskRepository.getTaskByTitle(title);
    }

    @Override
    public List<Task> getAllTasks() {
        return getAllTasksByParent();
    }

    private List<Task> getAllTasksByParent() {
        List<Task> allTasks = taskRepository.getAllTasks();
        List<Task> orderedTasks = new ArrayList<>();

        if(!allTasks.isEmpty()) {
            Task firstTask = allTasks.stream().filter(task -> task.getParent() == null).findFirst().get();
            orderedTasks.add(firstTask);

            for(int i=0; i < allTasks.size(); i++){
                Task nextTask = firstTask.getChild();
                orderedTasks.add(nextTask);
                firstTask = nextTask;
            }
        }
        return orderedTasks;
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
    public Task createTask(String name, Long date) {
        return createTask(name, date, categoryRepository.getRootCategory());
    }

    @Override
    public Task createTask(String name, Long date, Category category) {
        Task task = new Task(name, date);
        setTaskCategoryRelation(task, category);
        List<Task> allTasks = taskRepository.findAll();

        if(!allTasks.isEmpty()) {
            Task lastTask = allTasks.get(allTasks.size() - 1);
            lastTask.setChild(task);
            task.setParent(lastTask);
            taskRepository.save(lastTask);
        }
        taskRepository.save(task);
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
        List<Task> allTasks = taskRepository.findAll();

        if(!allTasks.isEmpty()) {
            Task parentTask = task.getParent();
            parentTask.setChild(task.getChild());

            Task childTask = task.getChild();
            childTask.setParent(task.getParent());

            taskRepository.save(parentTask);
            taskRepository.save(childTask);

            taskRepository.delete(task);
        }
    }


    @Override
    public void assignDate(Long taskId, Long date) {
        Task task = getTaskById(taskId);
        task.setDate(date);
        taskRepository.save(task);
    }

    @Override
    public void assignCategory(Long taskId, Long categoryId) {
        Task task = getTaskById(taskId);
        Category category = categoryRepository.getCategoryById(categoryId);
        setTaskCategoryRelation(task, category);
        taskRepository.save(task);
    }

    @Override
    public void setDone(Long taskId, boolean isDone) {
        Task task = getTaskById(taskId);
        task.setDone(isDone);
        taskRepository.save(task);
    }

    private void setTaskCategoryRelation(Task task, Category category){
        task.setCategory(category);
    }
}
