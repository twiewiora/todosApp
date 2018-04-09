package todosWebApp.persistence.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import javax.persistence.*;
import java.text.SimpleDateFormat;
import java.util.Calendar;


@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

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


        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(date);
        System.out.println("hour insert : " + cal.get(Calendar.HOUR));
    }

    @JsonProperty
    public Long getCategoryId(){
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

    @JsonProperty
    public String getCalendarDate() {
        Calendar cal = Calendar.getInstance();
        cal.setTimeInMillis(date);
        System.out.println("hour: " + cal.get(Calendar.HOUR));
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy MM dd HH:mm:ss");
        return sdf.format(cal.getTime());
    }

    public void setDate(Long date) {
        this.date = date;
    }

}
