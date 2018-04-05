package todosWebApp.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import todosWebApp.persistence.model.Category;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {


}