package todosWebApp.persistence.creators;

import todosWebApp.persistence.model.Category;

public interface CategoryDataCreator {

    Category createCategory(String name);

    Category createCategory(String name, Long parentCategoryId);

    void deleteCategory(Long categoryId);

    Category createRootCategoryIfNotExists();
}
