package todosWebApp.persistence.queries;

import todosWebApp.persistence.model.Category;

import java.util.List;

public interface CategoryDataQuery {
    List<Category> getAllCategories();

    Category getCategoryById(Long categoryId);

    Category getRootCategory();

    List<Category> getAllBaseCategories();
}
