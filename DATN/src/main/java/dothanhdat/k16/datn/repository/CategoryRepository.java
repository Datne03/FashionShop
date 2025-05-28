package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Category.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {
    Category findByName(String name);
    boolean existsByName(String name);

}
