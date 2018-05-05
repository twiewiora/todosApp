package todosWebApp;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.context.junit4.SpringRunner;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.service.CategoryService;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

@RunWith(SpringRunner.class)
@SpringBootTest(classes = TodosApplication.class)
@DirtiesContext(classMode = DirtiesContext.ClassMode.AFTER_EACH_TEST_METHOD)
public class CategoryServiceTest {

    @Autowired
    private CategoryService categoryService;

    @Before
    public void initDatabase(){
        Category category = categoryService.createCategory("house");
        categoryService.createCategory("tidying", category.getId());
    }

    @After
    public void cleanDatabase(){
        for(Category category : categoryService.getAllBaseCategories()){
            if (category.getParent() != null) {
                deleteCategory(category);
            }
        }
    }

    private void deleteCategory(Category category){
        for(Category child: categoryService.getChildren(category.getId())){
            deleteCategory(child);
        }
        categoryService.deleteCategory(category.getId());
    }

    @Test
    public void createCategoryTest(){
        Category c = categoryService.createCategory("homework");

        assertEquals(c.getName(), "homework");
        assertEquals(c.getParent().getId(), categoryService.getRootCategory().getId());
    }

    @Test
    public void deleteCategoryTest(){
        Category c = categoryService.createCategory("homework");
        deleteCategory(c);

        assertEquals(categoryService.getCategoryById(c.getId()), null);
    }

    @Test
    public void createRootCategoryIfNotExistsTest(){
        deleteCategory(categoryService.getRootCategory());

        categoryService.createRootCategoryIfNotExists();

        assertEquals(categoryService.getRootCategory().getName(), "root");
        assertEquals(categoryService.getRootCategory().getParent(), null);
    }

    @Test
    public void getAllCategoriesTest(){
        List<Category> categories = categoryService.getAllCategories();

        assertNotEquals(categories.get(0).getId(), categories.get(1).getId());
        assertEquals(categories.size(), 2);
    }

    @Test
    public void getCategoryByIdTest(){
        Category inserted = categoryService.createCategory("homework");
        Category category = categoryService.getCategoryById(inserted.getId());

        assertEquals(inserted.getId(), category.getId());
    }

    @Test
    public void getRootCategoryTest(){
        Category root = categoryService.getRootCategory();

        assertEquals(root.getParent(), null);
        assertEquals(root.getName(), "root");
    }

    @Test
    public void getChildrenTest(){
        List<Category> children = categoryService.getChildren(categoryService.getRootCategory().getId());

        assertEquals(children.size(), 1);
        assertEquals(children.get(0).getName(), "house");
    }

    @Test
    public void getAllBaseCategoriesTest(){
        List<Category> categories = categoryService.getAllBaseCategories();

        assertEquals(categories.size(), 1);
        assertEquals(categories.get(0).getName(), "house");

    }
}
