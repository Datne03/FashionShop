package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategorySubRepository extends JpaRepository<CategorySub, Integer> {

    List<CategorySub> findByParentId(int parentId);
}
