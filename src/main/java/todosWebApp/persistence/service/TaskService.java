package todosWebApp.persistence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import todosWebApp.persistence.creators.TaskDataCreator;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.OrderNode;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.queries.TaskDataQuery;
import todosWebApp.persistence.repository.CategoryRepository;
import todosWebApp.persistence.repository.OrderNodeRepository;
import todosWebApp.persistence.repository.TaskRepository;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;

@Service
@Transactional
public class TaskService implements TaskDataQuery, TaskDataCreator {

    private TaskRepository taskRepository;

    private CategoryRepository categoryRepository;

    private OrderNodeRepository orderRepository;

    @PersistenceContext
    private EntityManager em;

    @Autowired
    public TaskService(TaskRepository taskRepository, CategoryRepository categoryRepository, OrderNodeRepository orderRepository) {
        this.taskRepository = taskRepository;
        this.categoryRepository = categoryRepository;
        this.orderRepository = orderRepository;
    }

    private List<Task> sortByImportance(List<Task> tasks){
        return sortByImportance(tasks, categoryRepository.getRootCategory());
    }

    private List<Task> sortByImportance(List<Task> tasks, Category category){

        List<Task> orderedTasks = new ArrayList<>();

        if(!tasks.isEmpty()) {
            OrderNode node = getTopTaskForCategory(category.getId());
            while(node != null){
                orderedTasks.add(node.getTask());
                node= node.getChild();
            }
        }
        return orderedTasks;
    }


    @Override
    public void moveTask(Long taskId, Long newParentTaskId) {
        moveTaskInSubcategory(taskId, newParentTaskId, categoryRepository.getRootCategory());
    }

    @Override
    public void moveTaskInSubcategory(Long taskId, Long newParentTaskId, Category category) {
        if(!taskId.equals(newParentTaskId)) {
            OrderNode node = orderRepository.getTaskCategoryNode(taskId, category.getId());
            OrderNode parent = orderRepository.getTaskCategoryNode(newParentTaskId, category.getId());
            repinOrderNode(node, parent);
        }
    }

    private void repinOrderNode(OrderNode node, OrderNode parent){
        unpinOrderNode(node);
        pinOrderNode(node, parent);
    }

    private void pinOrderNode(OrderNode node, OrderNode parent){
        OrderNode child;
        if(parent != null)
            child = parent.getChild();
        else
            child = getTopTaskForCategory(node.getCategoryId());
        if(child != null){
            child.setParent(node);
            em.persist(child);
        }
        if(parent != null){
            parent.setChild(node);
            em.persist(parent);
        }

        node.setChild(child);
        node.setParent(parent);
        em.persist(node);
    }


    //does not persist node, only parent and child
    private void unpinOrderNode(OrderNode node){

        OrderNode parent = node.getParent();
        OrderNode child = node.getChild();

        if(parent != null){
            parent.setChild(child);
            em.persist(parent);
        }
        if(child != null){
            child.setParent(parent);
            em.persist(child);
        }
    }

    @Override
    public List<Task> getTaskByTitle(String title) {

        return sortByImportance(taskRepository.getTaskByTitle(title));
    }

    @Override
    public List<Task> getAllTasks() {
        return getAllTasksByParent();
    }

    private List<Task> getAllTasksByParent() {
        List<Task> allTasks = taskRepository.getAllTasks();
        return sortByImportance(allTasks);
    }

    @Override
    public Task getTaskById(Long taskId) {
        return taskRepository.getTaskById(taskId);
    }

    @Override
    public List<Task> getTasksByCategory(Long categoryId) {
        Category category = categoryRepository.getCategoryById(categoryId);
        return sortByImportance(getTasksFromSubcategories(category), category);
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
    public void moveTasksToParentCategory(Long categoryId){
        Category parentCategory = categoryRepository.getCategoryById(categoryId).getParent();
        List<Task> categoryTasks = getTasksByCategory(categoryId);
        if(categoryTasks.size() != 0){
            for(Task task : categoryTasks){
                task.setCategory(parentCategory);
                taskRepository.save(task);
            }
        }
    }

    @Override
    public List<Task> getTasksForGivenDay(Long date) {
        return sortByImportance(taskRepository.getTasksForGivenDay(date));
    }

    public List<Task> getTasksFromLastWeek(Long date) {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(date);
        cal.add(Calendar.DAY_OF_WEEK, -cal.get(Calendar.DAY_OF_WEEK) + 2);
        Long start = cal.getTimeInMillis();
        cal.add(Calendar.DAY_OF_WEEK, 1);
        Long end = cal.getTimeInMillis();
        return sortByImportance(getTasksFromInterval(start, end));
    }

    @Override
    public List<Task> getTasksFromInterval(Long startDate, Long endDate) {
        return taskRepository.getTasksFromInterval(startDate, endDate);
    }

    @Override
    public List<Task> getUnassignedTasks() {
        return sortByImportance(taskRepository.getUnassignedTasks());
    }

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
        em.persist(task);
        setTaskCategoryRelation(task, category);
        return task;
    }

    private void deleteOldOrders(Task task){
        for(OrderNode orderNode: task.getOrderList()){
            unpinOrderNode(orderNode);
        }
    }


    private void setTaskOrders(Task task, Category category){

        deleteOldOrders(task);

        while(category != null){
            OrderNode orderNode = new OrderNode(category.getId(), null, null, task);
            task.addOrderNode(orderNode);
            OrderNode first = getTopTaskForCategory(category.getId());

            if(first != null){
                first.setParent(orderNode);
                em.persist(first);
            }

            orderNode.setChild(first);
            em.persist(orderNode);
            category = category.getParent();
        }
    }

    public OrderNode getTopTaskForCategory(Long categoryId) {
        return orderRepository.getTopTaskForCategory(categoryId);
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

        for(OrderNode node: task.getOrderList()){
            unpinOrderNode(node);
            em.remove(node);
        }
        em.remove(task);

    }


    @Override
    public void assignDate(Long taskId, Long date) {
        Task task = getTaskById(taskId);
        task.setDate(date);
        em.persist(task);
    }

    @Override
    public void unassignDate(Long taskId) {
        Task task = getTaskById(taskId);
        task.setDate(null);
        taskRepository.save(task);
    }

    @Override
    public void assignCategory(Long taskId, Long categoryId) {
        Task task = getTaskById(taskId);
        Category category = categoryRepository.getCategoryById(categoryId);
        setTaskCategoryRelation(task, category);
        em.persist(task);
    }

    @Override
    public void setDone(Long taskId, boolean isDone) {
        Task task = getTaskById(taskId);
        task.setDone(isDone);
        em.persist(task);
    }

    private void setTaskCategoryRelation(Task task, Category category){
        task.setCategory(category);
        setTaskOrders(task, category);
    }
}
