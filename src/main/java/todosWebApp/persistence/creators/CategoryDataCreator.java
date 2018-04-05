package todosWebApp.persistence.creators;

import todosWebApp.persistence.model.Category;

import java.util.List;

public interface CategoryDataCreator {

    Category createCategory(String name);

    Category createCategory(String name, Long parentCategoryId);

    Category createRootCategoryIfNotExists();
}
