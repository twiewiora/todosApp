package todosWebApp.persistence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import todosWebApp.persistence.creators.TaskDataCreator;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.queries.TaskDataQuery;
import todosWebApp.persistence.repository.CategoryRepository;
import todosWebApp.persistence.repository.TaskRepository;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
public class TaskService implements TaskDataQuery, TaskDataCreator {

    private TaskRepository taskRepository;

    private CategoryRepository categoryRepository;

    @Autowired
    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
    }

    @Override
    public void moveTask(Long taskId, Long newParentTaskId) {
        Task toMove = getTaskById(taskId);

        Task toMovePrev = toMove.getParent();
        Task toMoveNext = toMove.getChild();
        if(toMovePrev != null){
            toMovePrev.setChild(toMoveNext);
            taskRepository.save(toMovePrev);
        }
        if(toMoveNext != null){
            toMoveNext.setParent(toMovePrev);
            taskRepository.save(toMoveNext);
        }

        if(newParentTaskId == null && toMove.getParent() != null){
            List<Task> orderedTasks = getAllTasks();
            Task firstTask = orderedTasks.get(0);
            firstTask.setParent(toMove);

            toMove.setParent(null);
            toMove.setChild(firstTask);

            taskRepository.save(toMove);
            taskRepository.save(firstTask);
        }
        else if (!taskId.equals(newParentTaskId)){
            Task parentTask = getTaskById(newParentTaskId);
            Task parentTaskChild = parentTask.getChild();
            parentTask.setChild(toMove);
            if(parentTaskChild != null)
                parentTaskChild.setParent(toMove);
            toMove.setParent(parentTask);
            toMove.setChild(parentTaskChild);

            taskRepository.save(toMove);
            taskRepository.save(parentTask);
            if(parentTaskChild != null)
                taskRepository.save(parentTaskChild);
        }
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

            for(int i=0; i < allTasks.size() - 1; i++){
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
        Category category = categoryRepository.getCategoryById(categoryId);
        return getTasksFromSubcategories(category);
    }

    private List<Task> getTasksFromSubcategories(Category currentCategory){
        List<Task> categoryTasks = new ArrayList<>(taskRepository.getTasksByCategory(currentCategory.getId()));
        List<Category> childCategories = categoryRepository.getChildren(currentCategory.getId());
//                Optional.ofNullable(categoryRepository.getChildren(currentCategory.getId()))
//                .ifPresent(childCategories -> childCategories.forEach(category -> categoryTasks.addAll(getTasksFromSubcategories(category))));
        if(childCategories != null) {
            for (Category category : childCategories)
                categoryTasks.addAll(getTasksFromSubcategories(category));
        }
        return categoryTasks;
    }

    @Override
    public List<Task> getTasksForGivenDay(Long date) {
        return taskRepository.getTasksForGivenDay(date);
    }

    public List<Task> getTasksFromLastWeek(Long date) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(date);
        cal.add(Calendar.DAY_OF_WEEK, -cal.get(Calendar.DAY_OF_WEEK) + 2);
        Long start = cal.getTimeInMillis();
        cal.add(Calendar.DAY_OF_WEEK, 1);
        Long end = cal.getTimeInMillis();
        return getTasksFromInterval(start, end);
    }

    @Override
    public List<Task> getTasksFromInterval(Long startDate, Long endDate) {
        return taskRepository.getTasksFromInterval(startDate, endDate);
    }

    @Override
    public List<Task> getUnassignedTasks() { return taskRepository.getUnassignedTasks(); }

    @Override
    public Task getLastUncheckedTask(){ return taskRepository.getLastUncheckedTask(); }

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
        List<Task> orderedTasks = getAllTasksByParent();

        if(!orderedTasks.isEmpty()) {
            Task firstTask = orderedTasks.get(0);
            firstTask.setParent(task);
            task.setChild(firstTask);
            taskRepository.save(task);
            taskRepository.save(firstTask);
        }
        else {
            taskRepository.save(task);
        }
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
            Task childTask = task.getChild();

            if(parentTask != null){
                parentTask.setChild(childTask);
                taskRepository.save(parentTask);
            }

            if(childTask != null){
                childTask.setParent(parentTask);
                taskRepository.save(childTask);
            }

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
