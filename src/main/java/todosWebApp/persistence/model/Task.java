package todosWebApp.persistence.model;

import javax.persistence.*;
import java.sql.Date;


@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String title;

    private Date date;

    private Boolean done = false;

    @ManyToOne
    @JoinColumn(name = "CATEGORY_FOREIGN_KEY")
    private Category category;

    public Task(){
    }

    public Task(String title, Date date) {
        this.title = title;
        this.date = date;
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

    public Date getDate() {
        return date;
    }
    public void setDate(Date date) {
        this.date = date;
    }

}
