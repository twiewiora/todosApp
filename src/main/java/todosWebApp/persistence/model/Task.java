package todosWebApp.persistence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.HashSet;
import java.util.Set;

@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

    @JsonIgnore
    @OneToMany(mappedBy="task")
    private Set<OrderNode> orderList = new HashSet<>();

    @Transient
    Category currentCategoryScope = null;

    public Set<OrderNode> getOrderList() {
        return orderList;
    }

    public void setOrderList(Set<OrderNode> orderList) {
        this.orderList = orderList;
    }

    private String title;

    @JsonIgnore
    private Long date;

    private Boolean done = false;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "CATEGORY_FOREIGN_KEY")
    private Category category;

    public Task(){
    }

    public Task(String title, Long date) {
        this.title = title;
        this.date = date;
    }

    @JsonProperty
    public Long getCategoryId() {
        return category.getId();
    }

    public void clearOrderList(){
        orderList.clear();
    }

    public void addOrderNode(OrderNode orderNode){
        orderList.add(orderNode);
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Boolean getDone() {
        return done;
    }

    public void setDone(Boolean done) {
        System.out.println("setting done " + title + " " + done);
        this.done = done;
    }

    public Long getId() {
		return id;
	}

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public Long getDate() {
        return date;
    }


    @JsonProperty
    public String getDeadline() {
        if (date != null) {
            SimpleDateFormat sdf = new SimpleDateFormat("yyyy MM dd HH:mm:ss");
            return sdf.format(date);
        } else {
            return "";
        }
    }

    public void setDate(Long date) {
        this.date = date;
    }

}
