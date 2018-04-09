package todosWebApp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

@RestController
public class TaskController {

    @Autowired
    private TaskService taskService;

    @Autowired
    private CategoryService categoryService;


    public TaskController() {
    }

    @RequestMapping(
            value = "/task/id/{id}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getTaskById(@PathVariable String id){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskById(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping(
            value = "/task/title/{title}",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getTaskByTitle(@PathVariable String title){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskByTitle(title));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping(value = "/task/getAll",
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getAllTasks() {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getAllTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping(
            value = "/task/create",
            method = RequestMethod.POST,
            produces = MediaType.APPLICATION_JSON_VALUE
    )
    public String createTask(@RequestParam String name,
                             @RequestParam(required = false) String date,
                             @RequestParam(required = false) String categoryID) {
        ObjectMapper objectMapper = new ObjectMapper();
        Task newTask;
        try {
            if (date != null && categoryID != null) {
                Long dateTask = Long.decode(date);
                Category category = categoryService.getCategoryById(Long.decode(categoryID));
                newTask = taskService.createTask(name, dateTask, category);
            } else if (date != null) {
                Long dateTask = Long.decode(date);
                newTask = taskService.createTask(name, dateTask);
            } else {
                newTask = taskService.createTask(name);
            }
            if (newTask != null) {
                return objectMapper.writeValueAsString(newTask);
            } else {
                return "false";
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return "false";
        }
    }

    @RequestMapping(value = "/task/setDone",
                    method = RequestMethod.POST)
    public void setTaskDone(@RequestParam String taskID, @RequestParam String checked) {
        taskService.setDone(Long.decode(taskID), Boolean.valueOf(checked));
    }

    @RequestMapping(value = "/task/delete",
                    method = RequestMethod.DELETE)
    public void deleteTask(@RequestParam String taskID) {
        taskService.deleteTask(Long.decode(taskID));
    }

    @RequestMapping(value = "task/swap",
                    method = RequestMethod.POST)
    public void swapTask(@RequestParam String firstTaskID, @RequestParam String secondTaskID) {
        // TODO gdy będzie gotowa obsługa zamiany tasków ze względu na priorytet
    }
}
