package todosWebApp.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.queries.CategoryDataQuery;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer>, CategoryDataQuery {

    @Override
    @Query("select category from Category category where not category.parent = null")
    List<Category> getAllCategories();

    @Override
    @Query("select category from Category category where category.id = :categoryId")
    Category getCategoryById(@Param("categoryId") Long categoryId);

    @Override
    @Query("select category from Category category where category.parent = null")
    Category getRootCategory();

    @Override
    @Query("select category from Category category where not category.parent = null and category.parent.parent = null")
    List<Category> getAllBaseCategories();

    @Override
    @Query("select category from Category category where category.parent.id = :categoryId")
    List<Category> getChildren(@Param("categoryId") Long categoryId);

}