package todosWebApp.persistence.model;

import javax.persistence.*;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @ManyToOne
    private Category parent;
    @OneToMany(fetch = FetchType.EAGER)
    private Set<Category> subCategories = new HashSet<>();

    @OneToMany(fetch = FetchType.EAGER)
    private Set<Task> tasks = new HashSet<>();

    public Category(){
    }

    public Category(String name){
        this.name = name;
    }

    public Set<Task> getTasks() {
        return tasks;
    }

    public void setTasks(Set<Task> tasks) {
        this.tasks = tasks;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getParent() {
        return parent;
    }

    public void setParent(Category parent) {
        this.parent = parent;
    }

    public void addSubCategory(Category category){
        subCategories.add(category);
    }

    public void removeSubCategory(Category category){
        subCategories.remove(category);
    }

    public void removeTask(Task task){
        tasks.remove(task);
    }

    public void addTask(Task task){
        tasks.add(task);
    }

    public Set<Category> getSubCategories() {
        return subCategories;
    }

    public void setSubCategories(Set<Category> subCategories) {
        this.subCategories = subCategories;
    }

}
