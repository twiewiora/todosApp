package todosWebApp.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.TaskService;

import java.util.List;

@Controller
public class TaskController {

    @Autowired
    private TaskService taskService;

    public TaskController() {
    }

    @RequestMapping(value = {"/home"}, method = RequestMethod.GET)
    public String index() {

        taskService.addTask(new Task("title1"));
        taskService.addTask(new Task("title2"));
        taskService.addTask(new Task("title3"));

        List<Task> list = taskService.getAll();
        list.forEach(task -> System.out.println(task.getTitle()));

        List<Task> list2 = taskService.findByTitle("title1");
        list2.forEach(task -> System.out.println(task.getTitle()));
        return "home";
    }
}
