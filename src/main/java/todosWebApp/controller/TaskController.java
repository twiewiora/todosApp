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

    //TODO implement all of the below mappings
    private final String URL_TASK_GET_BY_ID = "/task/id/{id}";
    private final String URL_TASK_GET_BY_TITLE = "/task/title/{title}";
    private final String URL_TASK_GET_BY_CATEGORY = "/task/categoryId/{categoryId}";
    private final String URL_TASK_GET_ALL = "/task/getAll";

    private final String URL_TASK_CREATE = "/task/create";
    private final String URL_TASK_SET_DONE = "/task/setDone";
    private final String URL_TASK_SET_DATE = "/task/setDate";
    private final String URL_TASK_SET_CATEGORY = "/task/setCategory";
    private final String URL_TASK_SET_ORDER = "task/move";
    private final String URL_TASK_DELETE = "/task/delete";

    private final String URL_CATEGORY_GET_BASE = "/category/getBase";
    private final String URL_CATEGORY_GET_ALL = "/category/getAll";
    private final String URL_CATEGORY_GET_BY_ID = "/category/id/{id}";

    private final String URL_CATEGORY_CREATE = "/category/create";

    private final String FAIL_RETURN_VALUE = "false";

    public TaskController() {
    }

    @RequestMapping(
            value = URL_TASK_GET_BY_ID,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getTaskById(@PathVariable String id){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskById(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_GET_BY_TITLE,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getTaskByTitle(@PathVariable String title){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskByTitle(title));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = URL_TASK_GET_ALL,
            method = RequestMethod.GET,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public String getAllTasks() {

        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getAllTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_CREATE,
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
                return FAIL_RETURN_VALUE;
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = URL_TASK_SET_DONE,
                    method = RequestMethod.POST)
    public void setTaskDone(@RequestParam String taskID, @RequestParam String checked) {
        taskService.setDone(Long.decode(taskID), Boolean.valueOf(checked));
    }

    @RequestMapping(value = URL_TASK_DELETE,
                    method = RequestMethod.DELETE)
    public void deleteTask(@RequestParam String taskID) {
        taskService.deleteTask(Long.decode(taskID));
    }

    @RequestMapping(value = URL_TASK_SET_ORDER,
                    method = RequestMethod.POST)
    public void moveTask
            (@RequestParam String taskID,
             @RequestParam(required = false) String newParentTaskId) {

        if(newParentTaskId == null)
            taskService.moveTask(Long.decode(taskID), null);
        else
            taskService.moveTask(Long.decode(taskID), Long.decode(newParentTaskId));
    }
}
