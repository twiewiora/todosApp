package todosWebApp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.service.CategoryService;
import todosWebApp.persistence.service.TaskService;

@Component
public class DatabaseInitializer {

    private TaskService taskService;

    private CategoryService categoryService;

    @Autowired
    public DatabaseInitializer(TaskService taskService, CategoryService categoryService) {
        this.taskService = taskService;
        this.categoryService = categoryService;
    }

    public void initializeDatabase() {
        if (categoryService.getRootCategory() == null) {
            categoryService.createRootCategoryIfNotExists();
            Category house = categoryService.createCategory("Dom", categoryService.getRootCategory().getId());
            Category job  = categoryService.createCategory("Praca", categoryService.getRootCategory().getId());

            taskService.createTask("Posprzątać garaż", house);
            taskService.createTask("Odkurzyć salon", house);
            taskService.createTask("Spotkanie z klientem", job);
            taskService.createTask("Wydrukować raporty", job);
            taskService.createTask("Wysłać faktury", job);
        }
    }
}
