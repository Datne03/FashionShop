package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryVoucherRepository extends JpaRepository<CategoryVoucher, Integer> {
    CategoryVoucher findByCategory(Category category);
    CategoryVoucher findById(int id);
}
