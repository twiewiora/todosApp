package todosWebApp.persistence.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.text.SimpleDateFormat;

@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "parent_foreign_key", referencedColumnName = "id")
    private Task parent;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "child_foreign_key", referencedColumnName = "id")
    private Task child;

	private String title;

	private String description = "";

    @JsonIgnore
    private Long date;

    private Boolean done = false;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "category_foreign_key")
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

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Long getDate() {
        return date;
    }

    public void setDate(Long date) { this.date = date; }

    public Task getParent() {
        return parent;
    }

    public void setParent(Task parent) {
        this.parent = parent;
    }

    public Task getChild() {
        return child;
    }

    public void setChild(Task child) {
        this.child = child;
    }

    public void editTask(String title, String description, Boolean done, Category category, Long date) {
        this.title = title;
        this.description = description;
        this.done = done;
        this.category = category;
        this.date = date;
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

}
