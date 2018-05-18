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
    @JoinColumn(name = "PARENT_FOREIGN_KEY", referencedColumnName = "id")
    private Task parent;

    @JsonIgnore
    @OneToOne
    @JoinColumn(name = "CHILD_FOREIGN_KEY", referencedColumnName = "id")
    private Task child;

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

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
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
