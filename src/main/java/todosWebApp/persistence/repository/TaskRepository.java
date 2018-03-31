package todosWebApp.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import todosWebApp.persistence.model.Task;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Integer> {

    @Query("select task from Task task where task.title = :title")
    public List<Task> findByTitle(@Param("title") String title);

}
