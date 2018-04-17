package todosWebApp;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import todosWebApp.controller.TaskController;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.TaskService;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(value = "file:webapp/WEB-INF/applicationContext.xml")
@TestExecutionListeners({ DependencyInjectionTestExecutionListener.class,
        DbUnitTestExecutionListener.class })
@DatabaseSetup(value = "classpath:dbunit-test.xml", type = DatabaseOperation.INSERT)
public class TaskServiceTest {

    @Autowired
    private TaskService taskService;

    @After
    public void cleanDatabase() {
        for( Task task : taskService.getAllTasks()){
            taskService.deleteTask(task.getId());
        }
    }

    @Test
    public void getTaskByTitleTest() {
        List<Task> taskList = taskService.getTaskByTitle("TitleTask_1");
        assertEquals("TitleTask_1", taskList.get(0).getTitle());
    }

    @Test
    public void getTaskByIdTest() {
        Task task = taskService.getTaskById(Long.valueOf(1));
        assertEquals(Long.valueOf(1), task.getId());
    }

    @Test
    public void getTaskByCategoryTest() {
        List<Task> taskList = taskService.getTasksByCategory(Long.valueOf(1));
        assertEquals(true, taskList.stream().anyMatch(task -> task.getTitle().equals("TitleTask_1")));
    }
    //TODO implement tests

    @Test
    public void getAllTasksTest(){}

    @Test
    public void createTaskTest(){}

    @Test
    public void setTaskDoneTest(){}

    @Test
    public void deleteTaskTest(){}

    @Test
    public void moveTaskTest(){}

    @Test
    public void assignDateTest(){}

    @Test
    public void assignCategoryTest(){}

    @Test
    public void getAllBaseCategoriesTest(){}

    @Test
    public void  getAllCategoriesTest(){}

    @Test
    public void getCategoryByIdTest(){}

    @Test
    public void createCategoryTest(){}



}
