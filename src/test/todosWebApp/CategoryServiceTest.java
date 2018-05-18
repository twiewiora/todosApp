package todosWebApp;

import org.junit.Test;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.MockitoAnnotations;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.repository.CategoryRepository;
import todosWebApp.persistence.service.CategoryService;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class CategoryServiceTest {

    private CategoryService categoryService;

    @Mock
    private CategoryRepository categoryRepository;

    public CategoryServiceTest() {
        MockitoAnnotations.initMocks(this);

        Category root = new Category("root");
        root.setId(1L);
        Category house = new Category("house");
        house.setParent(root);
        house.setId(2L);
        Category tidying = new Category("tidying");
        tidying.setParent(house);
        tidying.setId(3L);

        Mockito.when(categoryRepository.getRootCategory()).thenReturn(root);
        Mockito.when(categoryRepository.getAllCategories()).thenReturn(Arrays.asList(house, tidying));
        Mockito.when(categoryRepository.getCategoryById(1L)).thenReturn(root);
        Mockito.when(categoryRepository.getCategoryById(2L)).thenReturn(house);
        Mockito.when(categoryRepository.getCategoryById(3L)).thenReturn(tidying);
        Mockito.when(categoryRepository.getChildren(1L)).thenReturn(Collections.singletonList(house));
        Mockito.when(categoryRepository.getChildren(2L)).thenReturn(Collections.singletonList(tidying));
        Mockito.when(categoryRepository.getAllBaseCategories()).thenReturn(Collections.singletonList(house));

        categoryService = new CategoryService(categoryRepository);
    }

    @Test
    public void createRootCategoryIfNotExistsTest(){
        Category c = categoryService.createRootCategoryIfNotExists();

        assertEquals(c.getName(), "root");
        assertEquals(c.getParent(), null);
    }

    @Test
    public void getAllCategoriesTest(){
        List<Category> categories = categoryService.getAllCategories();

        assertNotEquals(categories.get(0).getId(), categories.get(1).getId());
        assertEquals(categories.size(), 2);
    }

    @Test
    public void getCategoryByIdTest(){
        Category root = categoryService.getRootCategory();
        Category category = categoryService.getCategoryById(root.getId());

        assertEquals(root.getId(), category.getId());
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
