package todosWebApp.persistence.model;

import javax.persistence.*;

@Entity
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private Long id;

	private String title;

	public Task(){
    }

    public Task(String title) {
        this.title = title;
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
}
