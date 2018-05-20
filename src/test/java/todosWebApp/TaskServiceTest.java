package todosWebApp;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.repository.CategoryRepository;
import todosWebApp.persistence.repository.TaskRepository;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class TaskServiceTest {

    private TaskService taskService;

    @Mock
    private TaskRepository taskRepository;

    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    public TaskServiceTest() {
        MockitoAnnotations.initMocks(this);

        Category root = new Category("root");
        root.setId(1L);
        Category house = new Category("house");
        house.setParent(root);
        house.setId(2L);
        Category tidying = new Category("tidying");
        tidying.setParent(house);
        tidying.setId(3L);

        Task task1 = new Task("TitleTask_1", 1000L);
        task1.setId(1L);
        task1.setDate(1000L);
        Task task2 = new Task("TitleTask_2", 1000L);
        task2.setId(2L);
        task2.setDate(2000L);
        Task task3 = new Task("cleaning room 1", 1000L);
        task3.setId(3L);
        task3.setCategory(tidying);

        task1.setChild(task2);
        task2.setParent(task1);
        task2.setChild(task3);
        task3.setParent(task2);

        Mockito.when(categoryRepository.getRootCategory()).thenReturn(root);
        Mockito.when(categoryRepository.getCategoryById(1L)).thenReturn(root);

        Mockito.when(taskRepository.getAllTasks()).thenReturn(Arrays.asList(task1, task2, task3));
        Mockito.when(taskRepository.getTaskByTitle("TitleTask_1")).thenReturn(Collections.singletonList(task1));
        Mockito.when(taskRepository.getTaskById(1L)).thenReturn(task1);
        Mockito.when(taskRepository.getTasksByCategory(root.getId())).thenReturn(Arrays.asList(task1, task2));
        Mockito.when(taskRepository.getTasksForGivenDay(1000L)).thenReturn(Collections.singletonList(task1));
        Mockito.when(taskRepository.getTasksFromInterval(500L, 2500L)).thenReturn(Arrays.asList(task1, task2));
        Mockito.when(taskRepository.getTasksFromInterval(500L, 2500L)).thenReturn(Arrays.asList(task1, task2));

        taskService = new TaskService(taskRepository, categoryRepository);
        categoryService = new CategoryService(categoryRepository);
    }

    @Test
    public void getTaskByTitleTest() {
        List<Task> taskList = taskService.getTaskByTitle("TitleTask_1");
        assertEquals("TitleTask_1", taskList.get(0).getTitle());
    }

    @Test
    public void getTaskByIdTest() {
        Task task = taskService.getTaskById(1L);
        assertEquals(task.getTitle(), "TitleTask_1");
        assertEquals(task.getChild().getId(), Long.valueOf(2L));
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
    public void getTasksForGivenDayTest(){
        List<Task> tasks = taskService.getTasksForGivenDay(1000L);

        assertEquals(tasks.get(0).getTitle(), "TitleTask_1");
    }

    @Test
    public void getTasksFromIntervalTest(){
        List<Task> tasks = taskService.getTasksFromInterval(500L, 2500L);

        assertEquals(true, tasks.stream().anyMatch(task -> task.getTitle().equals("TitleTask_1")));
        assertEquals(true, tasks.stream().anyMatch(task -> task.getTitle().equals("TitleTask_2")));
        assertEquals(2, tasks.size());
    }

}
