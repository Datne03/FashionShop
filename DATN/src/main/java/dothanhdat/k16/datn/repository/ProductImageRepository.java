package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ProductImageRepository extends JpaRepository<ProductImage, Integer> {
    List<ProductImage> findByProduct(Product product);

    void deleteByProduct(Product product);
//    List<ProductImage> findAllByProduct(Product product);
//    void deleteProductImageByProduct(Product product);
//    List<ProductImage> findByProductId(int productId);
}
