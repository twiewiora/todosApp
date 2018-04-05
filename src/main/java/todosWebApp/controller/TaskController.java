package todosWebApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

import java.sql.Date;
import java.util.List;

@Controller
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


        System.out.println(categoryService.getRootCategory());

//        taskService.addTask(new Task("title1", new Date(System.currentTimeMillis())));
//        taskService.addTask(new Task("title2", new Date(System.currentTimeMillis())));
//        taskService.addTask(new Task("title3", new Date(System.currentTimeMillis())));

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
}
