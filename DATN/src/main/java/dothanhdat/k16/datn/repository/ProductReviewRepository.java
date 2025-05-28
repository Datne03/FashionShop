package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.dto.response.ProductReviewResponse;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductReview;
import dothanhdat.k16.datn.entity.User.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductReviewRepository extends JpaRepository<ProductReview, Integer> {
    List<ProductReview> findByProductId(int productId);

    List<ProductReview> findByUser(User user);
//    List<ProductReview> findByProductId(int productId);
//    // List<ProductReview> findByProductId(int productId, Pageable pageable);
//    List<ProductReview> findByUserId(int userId);

}
