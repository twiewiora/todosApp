package todosWebApp.persistence.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import todosWebApp.persistence.model.OrderNode;

public interface OrderNodeRepository  extends JpaRepository<OrderNode, Integer> {

    @Query("select orderNode from OrderNode orderNode where orderNode.categoryId = :categoryId and orderNode.parent = null")
    OrderNode getTopTaskForCategory(@Param("categoryId") Long categoryId);

    @Query("select orderNode from OrderNode orderNode where orderNode.categoryId = :categoryId and orderNode.task.id = :taskId")
    OrderNode getTaskCategoryNode(@Param("taskId") Long taskId, @Param("categoryId") Long categoryId);
}
