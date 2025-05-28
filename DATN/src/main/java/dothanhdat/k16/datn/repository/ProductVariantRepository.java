package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductVariantRepository extends JpaRepository<ProductVariant, Integer> {
    void deleteProductAttributesByProduct(Product product);
    List<ProductVariant> findProductVariantsByProduct(Product product);

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.product = :product AND pv.color = :color AND pv.size = :size")
    ProductVariant findProductVariantByProductAndColorAndSize(
            @Param("product") Product product,
            @Param("color") String color,
            @Param("size") String size);

    @Query(value = "SELECT * FROM product_variant WHERE product_id = :productId AND color = :color AND size = :size", nativeQuery = true)
    ProductVariant findByProductColorAndSize(
            @Param("productId") int productId,
            @Param("color") String color,
            @Param("size") int size);


    // List<ProductAttributeResponse> findByProductId(int productId);

    @Query(value = "SELECT SUM(o.stock) " +
            "FROM datn.product_variant o " +
            "WHERE o.product_id = :product_id AND o.color = :color AND o.size = :size", nativeQuery = true)
    int getSumOfProduct(@Param("product_id") int product_id, @Param("color") String color, @Param("size") String size);

    @Query(value = "SELECT SUM(o.stock) " +
            "FROM dacn.product_attribute o " +
            "WHERE o.id = :id", nativeQuery = true)
    int getSumOfProductVariant(@Param("id") int id);

    @Query(value = "SELECT * FROM product_attribute WHERE product_id = :productId AND color = :color AND size = :size", nativeQuery = true)
    ProductVariant findByProductColorAndSize(
            @Param("productId") int productId,
            @Param("color") String color,
            @Param("size") String size);

    List<ProductVariant> findAllByProduct(Product product);

    @Query("SELECT pv FROM ProductVariant pv WHERE pv.deleted = false")
    List<ProductVariant> findAllActive();

    //  List<ProductAttribute> findByProductId(int productId);

}
