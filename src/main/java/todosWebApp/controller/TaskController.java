package todosWebApp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.model.Task;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

import java.text.ParseException;
import java.text.SimpleDateFormat;

@RestController
public class TaskController {

    private TaskService taskService;

    private CategoryService categoryService;

    private SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy");

    private final String crossOriginUrl = "http://localhost:3000";

    @Autowired
    public TaskController(TaskService taskService, CategoryService categoryService) {
        this.taskService = taskService;
        this.categoryService = categoryService;
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_BY_ID,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getTaskById(@PathVariable String id){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskById(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_BY_TITLE,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getTaskByTitle(@PathVariable String title){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskByTitle(title));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_GIVEN_DAY,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getTaskForGivenDay(@PathVariable String date){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Long time = dateFormatter.parse(date).getTime();
            return objectMapper.writeValueAsString(taskService.getTasksForGivenDay(time));
        } catch (ParseException | JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_LAST_WEEK,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getTaskFromLastWeek(@PathVariable String date){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Long time = dateFormatter.parse(date).getTime();
            return objectMapper.writeValueAsString(taskService.getTasksFromLastWeek(time));
        } catch (ParseException | JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_BY_CATEGORY,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getTaskByCategory(@PathVariable String id){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTasksByCategory(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_GET_UNASSIGNED,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getUnassignedTasks(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println("TASKI:");
            System.out.println(taskService.getUnassignedTasks());
            return objectMapper.writeValueAsString(taskService.getUnassignedTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = UrlRequest.URL_TASK_GET_ALL,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getAllTasks() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getAllTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value =  UrlRequest.URL_TASK_GET_LAST_UNCHECKED_TASK,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getLastUncheckedTask() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getLastUncheckedTask());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_CREATE,
            method = RequestMethod.POST,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String createTask(@RequestParam String title,
                             @RequestParam(required = false) String date,
                             @RequestParam(required = false) String categoryID) {
        ObjectMapper objectMapper = new ObjectMapper();
        Task newTask;
        try {
            if (date != null && categoryID != null) {
                Long dateTask = dateFormatter.parse(date).getTime();
                Category category = categoryService.getCategoryById(Long.decode(categoryID));
                newTask = taskService.createTask(title, dateTask, category);
            } else if (date != null) {
                Long dateTask = dateFormatter.parse(date).getTime();
                newTask = taskService.createTask(title, dateTask);
            } else if(categoryID != null){
                Category category = categoryService.getCategoryById(Long.decode(categoryID));
                newTask = taskService.createTask(title, category);
            } else {
                newTask = taskService.createTask(title);
            }
            if (newTask != null) {
                return objectMapper.writeValueAsString(newTask);
            } else {
                return UrlRequest.FAIL_RETURN_VALUE;
            }
        } catch (JsonProcessingException | ParseException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = UrlRequest.URL_TASK_SET_DONE,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void setTaskDone(@PathVariable String id) {
        if (taskService.getTaskById(Long.decode(id)).getDone()) {
            taskService.setDone(Long.decode(id), false);
        } else {
            taskService.setDone(Long.decode(id), true);
        }
    }

    @RequestMapping(value = UrlRequest.URL_TASK_DROP,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void setTaskDoneAndDrop(@RequestParam String id, @RequestParam(required = false) String parent) {
        //long taskId = Long.decode(id);
        if (taskService.getTaskById(Long.decode(id)).getDone()) {
            taskService.setDone(Long.decode(id), false);
        } else {
            taskService.setDone(Long.decode(id), true);
        }
        moveTask(id, parent);
    }

    @RequestMapping(value = UrlRequest.URL_TASK_DELETE,
            method = RequestMethod.DELETE)
    @CrossOrigin(origins = crossOriginUrl)
    public void deleteTask(@PathVariable String id) {
        taskService.deleteTask(Long.decode(id));
    }

    @RequestMapping(value = UrlRequest.URL_TASK_SET_ORDER,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void moveTask
            (@RequestParam String taskID,
             @RequestParam(required = false) String newParentTaskId) {

        if(newParentTaskId == null)
            taskService.moveTask(Long.decode(taskID), null);
        else
            taskService.moveTask(Long.decode(taskID), Long.decode(newParentTaskId));
    }

    @RequestMapping(value = UrlRequest.URL_TASK_SET_DATE,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void assignDate
            (@RequestParam String taskID,
             @RequestParam String date) {
        try {
            taskService.assignDate(Long.decode(taskID), dateFormatter.parse(date).getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = UrlRequest.URL_TASK_UNSET_DATE,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void unassignDate
            (@RequestParam String taskID) {
        try {
            taskService.unassignDate(Long.decode(taskID));
        } catch (NumberFormatException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_TASK_EDIT,
            method = RequestMethod.POST)
           // produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String editTask(@RequestParam String id,
                           @RequestParam String title,
                           @RequestParam Boolean done,
                           @RequestParam String date,
                           @RequestParam String categoryID){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Long dateTask;
            if(!date.equals("")) {
                dateTask = dateFormatter.parse(date).getTime();
            }
            else {
                dateTask = null;
            }
            Category category = categoryService.getCategoryById(Long.decode(categoryID));
            return objectMapper.writeValueAsString(taskService.editTask(Long.decode(id), title, done, category, dateTask));
        } catch (ParseException | JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }
}

