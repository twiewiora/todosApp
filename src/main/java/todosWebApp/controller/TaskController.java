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

    private final String URL_TASK_GET_BY_ID = "/task/id/{id}";
    private final String URL_TASK_GET_BY_TITLE = "/task/title/{title}";
    private final String URL_TASK_GET_BY_CATEGORY = "/task/category{id}";
    private final String URL_TASK_GET_UNASSIGNED = "/task/unassigned";
    private final String URL_TASK_GET_ALL = "/task/getAll";
    private final String URL_TASK_GET_GIVEN_DAY = "/task/dailyTasks/date={date}";
    private final String URL_TASK_GET_LAST_WEEK = "/task/weeklyTasks/date={date}";
    private final String URL_TASK_GET_LAST_UNCHECKED_TASK = "/task/lastUnchecked";
    private final String URL_TASK_CREATE = "/task/create";
    private final String URL_TASK_DROP = "/task/drop";
    private final String URL_TASK_SET_DONE = "/task/setDone{id}";
    private final String URL_TASK_SET_DATE = "/task/setDate";
    private final String URL_TASK_SET_CATEGORY = "/task/setCategory";
    private final String URL_TASK_SET_ORDER = "/task/move";
    private final String URL_TASK_DELETE = "/task/delete{id}";
    private final String URL_CATEGORY_GET_BASE = "/category/getBase";
    private final String URL_CATEGORY_GET_ALL = "/category/getAll";
    private final String URL_CATEGORY_GET_BY_ID = "/category/id/{id}";
    private final String URL_CATEGORY_GET_SUBCATEGORIES_BY_PARENT = "/category/subcategories/{id}";
    private final String URL_CATEGORY_CREATE = "/category/create";
    private final String FAIL_RETURN_VALUE = "false";

    SimpleDateFormat dateFormatter = new SimpleDateFormat("dd-MM-yyyy");

    @Autowired
    public TaskController(TaskService taskService, CategoryService categoryService) {
        this.taskService = taskService;
        this.categoryService = categoryService;
    }

    @RequestMapping(
            value = URL_TASK_GET_BY_ID,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
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
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getTaskByTitle(@PathVariable String title){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTaskByTitle(title));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_GET_GIVEN_DAY,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getTaskForGivenDay(@PathVariable String date){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Long time = dateFormatter.parse(date).getTime();
            return objectMapper.writeValueAsString(taskService.getTasksForGivenDay(time));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        } catch (ParseException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_GET_LAST_WEEK,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getTaskFromLastWeek(@PathVariable String date){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            Long time = dateFormatter.parse(date).getTime();
            return objectMapper.writeValueAsString(taskService.getTasksFromLastWeek(time));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        } catch (ParseException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_GET_BY_CATEGORY,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getTaskByCategory(@PathVariable String id){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getTasksByCategory(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_GET_UNASSIGNED,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getUnassignedTasks(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            System.out.println("TASKI:");
            System.out.println(taskService.getUnassignedTasks());
            return objectMapper.writeValueAsString(taskService.getUnassignedTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }



    @RequestMapping(value = URL_TASK_GET_ALL,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getAllTasks() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getAllTasks());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value =  URL_TASK_GET_LAST_UNCHECKED_TASK,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getLastUncheckedTask() {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(taskService.getLastUncheckedTask());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_TASK_CREATE,
            method = RequestMethod.POST,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String createTask(@RequestParam String title,
                             @RequestParam(required = false) String date,
                             @RequestParam(required = false) String categoryID) {
        ObjectMapper objectMapper = new ObjectMapper();
        Task newTask;
        System.out.println("DATA");
        System.out.println(date);
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
                return FAIL_RETURN_VALUE;
            }
        } catch (JsonProcessingException | ParseException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = URL_TASK_SET_DONE,
            method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public void setTaskDone(@PathVariable String id) {
        if (taskService.getTaskById(Long.decode(id)).getDone()) {
            taskService.setDone(Long.decode(id), false);
        } else {
            taskService.setDone(Long.decode(id), true);
        }
    }

    @RequestMapping(value = URL_TASK_DROP,
            method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public void setTaskDoneAndDrop(@RequestParam String id, @RequestParam(required = false) String parent) {
        //long taskId = Long.decode(id);
        if (taskService.getTaskById(Long.decode(id)).getDone()) {
            taskService.setDone(Long.decode(id), false);
        } else {
            taskService.setDone(Long.decode(id), true);
        }
        moveTask(id, parent);
    }


    @RequestMapping(value = URL_TASK_DELETE,
            method = RequestMethod.DELETE)
    @CrossOrigin(origins = "http://localhost:3000")
    public void deleteTask(@PathVariable String id) {
        taskService.deleteTask(Long.decode(id));
    }

    @RequestMapping(value = URL_TASK_SET_ORDER,
            method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public void moveTask
            (@RequestParam String taskID,
             @RequestParam(required = false) String newParentTaskId) {

        if(newParentTaskId == null)
            taskService.moveTask(Long.decode(taskID), null);
        else
            taskService.moveTask(Long.decode(taskID), Long.decode(newParentTaskId));
    }

    @RequestMapping(value = URL_TASK_SET_DATE,
            method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public void assignDate
            (@RequestParam String taskID,
             @RequestParam String date) {
        try {
            taskService.assignDate(Long.decode(taskID), dateFormatter.parse(date).getTime());
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @RequestMapping(value = URL_TASK_SET_CATEGORY,
            method = RequestMethod.POST)
    @CrossOrigin(origins = "http://localhost:3000")
    public void assignCategory
            (@RequestParam String taskID,
             @RequestParam String categoryId) {
        taskService.assignCategory(Long.decode(taskID), Long.decode(categoryId));
    }

    @RequestMapping(
            value = URL_CATEGORY_GET_BASE,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getAllBaseCategories(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getAllBaseCategories());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_CATEGORY_GET_ALL,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String  getAllCategories(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getAllCategories());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_CATEGORY_GET_BY_ID,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getCategoryById(@PathVariable String id) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getCategoryById(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = URL_CATEGORY_GET_SUBCATEGORIES_BY_PARENT,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String getChildren(@PathVariable String id) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getChildren(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value =   URL_CATEGORY_CREATE,
            method = RequestMethod.POST,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = "http://localhost:3000")
    public String createCategory(@RequestParam String name,
                                 @RequestParam(required = false) String parentCategoryId) {
        ObjectMapper objectMapper = new ObjectMapper();
        Category newCategory;
        try {
            if (parentCategoryId != null) {
                newCategory = categoryService.createCategory(name, Long.decode(parentCategoryId));
            } else {
                newCategory = categoryService.createCategory(name);
            }
            if (newCategory != null) {
                return objectMapper.writeValueAsString(newCategory);
            } else {
                return FAIL_RETURN_VALUE;
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return FAIL_RETURN_VALUE;
        }
    }


}

