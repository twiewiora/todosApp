package todosWebApp;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TodosApplication.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @Autowired
    private CategoryService categoryService;

    @Before
    public void initDatabase(){
        categoryService.createRootCategoryIfNotExists();


        taskService.createTask("TitleTask_1", 1000L);
        taskService.createTask("TitleTask_2", 1000L);

        Category house = categoryService.createCategory("house");
        Category tidying = categoryService.createCategory("tidying", house.getId());

        taskService.createTask("cleaning room 1", tidying);

    }

    @After
    public void cleanDatabase() {
        for( Task task : taskService.getAllTasks()){
            taskService.deleteTask(task.getId());
        }

        deleteCategory(categoryService.getRootCategory());

        for(Category category : categoryService.getAllCategories()){

            categoryService.deleteCategory(category.getId());
        }
        categoryService.createRootCategoryIfNotExists();
    }

    private void deleteCategory(Category category){
        for(Category child: categoryService.getChildren(category.getId())){
            deleteCategory(child);
        }

        categoryService.deleteCategory(category.getId());
    }

    @Test
    public void getTaskByTitleTest() {
        List<Task> taskList = taskService.getTaskByTitle("TitleTask_1");
        assertEquals("TitleTask_1", taskList.get(0).getTitle());
    }

    @Test
    public void getTaskByIdTest() {
        Task inserted = taskService.createTask("work");
        Task task = taskService.getTaskById(inserted.getId());
        assertEquals(inserted.getId(), task.getId());
    }

    @Test
    public void getTaskByCategoryTest() {
        List<Task> taskList = taskService.getTasksByCategory(categoryService.getRootCategory().getId());
        assertEquals(true, taskList.stream().anyMatch(task -> task.getTitle().equals("TitleTask_1")));
    }

    @Test
    public void getAllTasksTest(){
        List<Task> tasks = taskService.getAllTasks();

        assertNotEquals(tasks.get(0).getId(), tasks.get(1).getId());
    }

    @Test
    public void createTaskTest(){

        Task t1 = taskService.createTask("work", 1000L);

        assertEquals(t1.getCategory().getName(), "root");
        assertEquals(t1.getDate(), Long.valueOf(1000L));
        assertEquals(t1.getTitle(), "work");

    }

    @Test
    public void setTaskDoneTest(){

        Task t1 = taskService.createTask("work", 1000L);
        assertEquals(t1.getDone(), false);

        taskService.setDone(t1.getId(), true);
        assertEquals(taskService.getTaskById(t1.getId()).getDone(), true);


    }

    @Test
    public void deleteTaskTest(){
        Task t1 = taskService.createTask("work", 1000L);

        taskService.deleteTask(t1.getId());
        assertEquals(taskService.getTaskById(t1.getId()), null);

    }

    @Test
    public void moveTaskTest(){
        //TODO implement test
    }

    @Test
    public void assignDateTest(){

        Task t1 = taskService.createTask("work", 1000L);

        assertEquals(t1.getDate(), Long.valueOf(1000L));

        taskService.assignDate(t1.getId(), 2000L);

        assertEquals(taskService.getTaskById(t1.getId()).getDate(), Long.valueOf(2000L));


    }

    @Test
    public void assignCategoryTest(){
        Task t1 = taskService.createTask("work", 1000L);
        Category c1 = categoryService.createCategory("job");

        taskService.assignCategory(t1.getId(), c1.getId());

        assertEquals(taskService.getTaskById(t1.getId()).getCategory().getName(), "job");

    }
}
