package todosWebApp.persistence.service;

import todosWebApp.persistence.model.Category;

import java.util.List;

public interface CategoryDatabase {

    List<Category> getAllCategories();

    Category getCategoryById(Long categoryId);

    Category getRootCategory();

    List<Category> getAllBaseCategories();

    void createCategory(String name);

    void createCategory(String name, Long parentCategoryId);


}
