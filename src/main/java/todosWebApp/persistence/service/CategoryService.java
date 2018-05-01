package todosWebApp.persistence.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import todosWebApp.persistence.creators.CategoryDataCreator;
import todosWebApp.persistence.model.Category;
import todosWebApp.persistence.queries.CategoryDataQuery;
import todosWebApp.persistence.repository.CategoryRepository;

import java.util.List;

@Component
@Transactional
public class CategoryService implements CategoryDataCreator, CategoryDataQuery {

    @Autowired
    private CategoryRepository categoryRepository;

    public CategoryService(){
    }

    public CategoryService(CategoryRepository categoryRepository) {
        this.categoryRepository = categoryRepository;
    }

    @Override
    public Category createCategory(String name) {
        Category category = new Category(name);
        setCategoryParentRelation(category, getRootCategory());
        categoryRepository.save(category);
        return category;
    }

    @Override
    public Category createCategory(String name, Long parentCategoryId) {
        Category category = new Category(name);
        setCategoryParentRelation(category, getCategoryById(parentCategoryId));
        categoryRepository.save(category);
        return category;
    }

    @Override
    public void deleteCategory(Long categoryId) {
        Category category = getCategoryById(categoryId);

        categoryRepository.delete(category);
    }

    @Override
    public Category createRootCategoryIfNotExists() {
        Category root = getRootCategory();

        if(root == null){
            root = new Category();
            root.setName("root");
            root.setParent(null);
            categoryRepository.save(root);
        }

        return root;
    }

    @Override
    public List<Category> getAllCategories() {
        return categoryRepository.getAllCategories();
    }

    @Override
    public Category getCategoryById(Long categoryId) {
        return categoryRepository.getCategoryById(categoryId);
    }

    @Override
    public Category getRootCategory() {
        return categoryRepository.getRootCategory();
    }

    @Override
    public List<Category> getChildren(Long categoryId) {
        return categoryRepository.getChildren(categoryId);
    }

    @Override
    public List<Category> getAllBaseCategories() {
        return categoryRepository.getAllBaseCategories();
    }

    private static void setCategoryParentRelation(Category child, Category parent){
        child.setParent(parent);
    }
}