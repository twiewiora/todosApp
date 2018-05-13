package todosWebApp.persistence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;

@Entity
public class OrderNode {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private Long categoryId;

    @OneToOne
    @JoinColumn(name = "PARENT_FOREIGN_KEY", referencedColumnName = "id")
    private OrderNode parent;

    @OneToOne
    @JoinColumn(name = "CHILD_FOREIGN_KEY", referencedColumnName = "id")
    private OrderNode child;

    @ManyToOne
    @JoinColumn(name="task_id")
    private Task task;

    public OrderNode() {

    }

    public Task getTask() {
        return task;
    }

    public void setTask(Task task) {
        this.task = task;
    }

    public OrderNode(Long categoryId, OrderNode parent, OrderNode child, Task task) {
        this.categoryId = categoryId;
        this.parent = parent;
        this.child = child;
        this.task = task;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public OrderNode getParent() {
        return parent;
    }

    public void setParent(OrderNode parent) {
        this.parent = parent;
    }

    public OrderNode getChild() {
        return child;
    }

    public void setChild(OrderNode child) {
        this.child = child;
    }
}
