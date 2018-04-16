package todosWebApp;

import com.github.springtestdbunit.DbUnitTestExecutionListener;
import com.github.springtestdbunit.annotation.DatabaseOperation;
import com.github.springtestdbunit.annotation.DatabaseSetup;
import org.junit.After;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestExecutionListeners;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.support.DependencyInjectionTestExecutionListener;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.TaskService;

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
        taskService.deleteTask(taskService.getTaskByTitle("TitleTask_1").get(0));
        taskService.deleteTask(taskService.getTaskByTitle("TitleTask_2").get(0));
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

}
