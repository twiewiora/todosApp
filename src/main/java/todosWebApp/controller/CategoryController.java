package todosWebApp.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

@RestController
public class CategoryController {

    private TaskService taskService;

    private CategoryService categoryService;

    private final String crossOriginUrl = "http://localhost:3000";

    @Autowired
    public CategoryController(TaskService taskService, CategoryService categoryService) {
        this.taskService = taskService;
        this.categoryService = categoryService;
    }

    @RequestMapping(value = UrlRequest.URL_TASK_SET_CATEGORY,
            method = RequestMethod.POST)
    @CrossOrigin(origins = crossOriginUrl)
    public void assignCategory
            (@RequestParam String taskID,
             @RequestParam String categoryId) {
        taskService.assignCategory(Long.decode(taskID), Long.decode(categoryId));
    }

    @RequestMapping(
            value = UrlRequest.URL_CATEGORY_GET_ROOT,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getRootCategory(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getRootCategory());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_CATEGORY_GET_BASE,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getAllBaseCategories(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getAllBaseCategories());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_CATEGORY_GET_ALL,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String  getAllCategories(){
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getAllCategories());
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_CATEGORY_GET_BY_ID,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getCategoryById(@PathVariable String id) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getCategoryById(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value = UrlRequest.URL_CATEGORY_GET_SUBCATEGORIES_BY_PARENT,
            method = RequestMethod.GET,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String getChildren(@PathVariable String id) {
        ObjectMapper objectMapper = new ObjectMapper();
        try {
            return objectMapper.writeValueAsString(categoryService.getChildren(Long.decode(id)));
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(
            value =   UrlRequest.URL_CATEGORY_CREATE,
            method = RequestMethod.POST,
            produces = "application/json; charset=UTF-8")
    @CrossOrigin(origins = crossOriginUrl)
    public String createCategory(@RequestParam String name,
                                 @RequestParam(required = false) String parentCategoryId) {
        ObjectMapper objectMapper = new ObjectMapper();
        Category newCategory;
        try {
            System.out.println("PARENT CATEGORY"+parentCategoryId);
            if (parentCategoryId != null) {
                newCategory = categoryService.createCategory(name, Long.decode(parentCategoryId));
            } else {
                newCategory = categoryService.createCategory(name);
            }
            if (newCategory != null) {
                return objectMapper.writeValueAsString(newCategory);
            } else {
                return UrlRequest.FAIL_RETURN_VALUE;
            }
        } catch (JsonProcessingException e) {
            e.printStackTrace();
            return UrlRequest.FAIL_RETURN_VALUE;
        }
    }

    @RequestMapping(value = UrlRequest.URL_CATEGORY_DELETE,
            method = RequestMethod.DELETE)
    @CrossOrigin(origins = crossOriginUrl)
    public void deleteCategory(@PathVariable String id) {
        taskService.moveTasksToParentCategory(Long.decode(id));
        categoryService.deleteCategory(Long.decode(id));
    }
}
