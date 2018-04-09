package todosWebApp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

import java.sql.Date;
import java.util.List;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private CategoryService categoryService;


    public TaskController() {
    }

    @RequestMapping(value = {"/home"}, method = RequestMethod.GET)
    public String index() {
        categoryService.createRootCategoryIfNotExists();

        Task t1 =taskService.createTask("title1", new Date(System.currentTimeMillis()));
        Category c1 = categoryService.createCategory("level1");
        Category c2 = categoryService.createCategory("level2", c1.getId());
        taskService.createTask("c2 task", c2);
        taskService.assignDate(t1.getId(), new Date(0L));

        List<Task> list = taskService.getAllTasks();
        list.forEach(task -> System.out.println(task.getTitle()));

        List<Task> list2 = taskService.findByTitle("title1");
        list2.forEach(task -> System.out.println(task.getTitle()));
        return "home";
    }


    @RequestMapping(value = {"/task/getAll"}, method = RequestMethod.GET)
    public String getAllTasks() {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getAllTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "false";
        }
    }
}
