package dothanhdat.k16.datn.repository;

import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import dothanhdat.k16.datn.entity.Product.Product;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface ProductRepository extends JpaRepository<Product, Integer>, JpaSpecificationExecutor<Product> {
    List<Product> findBySubCategoryId(int subCategoryId);

   // List<Product> findTop4ByOrderBySoldQuantityDesc();

    @Query("select count (p) from Product p where p.subCategory.parent.id = :id")
    int getNumberProductOfCategory(int id);

    @Query("SELECT MAX(p.price) FROM Product p")
    Double findMaxPrice();

    @Query("SELECT MIN(p.price) FROM Product p")
    Double findMinPrice();

    @Query("SELECT p FROM Product p WHERE p.deleted = false ORDER BY p.soldQuantity DESC")
    List<Product> findTopSellingProducts(Pageable pageable);


    @Query(value = """
        SELECT c.name AS category_name, SUM(pv.stock) AS total_stock
        FROM product_variant pv
        JOIN product p ON pv.product_id = p.id
        JOIN category_sub cs ON p.category_sub_id = cs.id
        JOIN category c ON cs.category_id = c.id
        GROUP BY c.name
        """, nativeQuery = true)
    List<Object[]> getProductNameAndStock();

    @Query(value = "SELECT c.name, p.name, SUM(pv.stock) AS total_stock " +
            "FROM datn.product_attribute pv " +
            "INNER JOIN datn.product p ON pv.product_id = p.id " +
            "INNER JOIN datn.category c ON p.category_id = c.id " +
            "GROUP BY p.name, c.name",
            nativeQuery = true)
    List<Object[]> getProductNameAndStockAndCategoryTypeName();

    @Query(value = "SELECT MONTH(p.created_at) AS month, " +
            "SUM(v.stock) AS totalStock, " +
            "SUM(p.sold_quantity) AS totalSold " +
            "FROM datn.product p " +
            "INNER JOIN datn.product_variant v ON p.id = v.product_id " +
            "WHERE YEAR(p.created_at) = YEAR(CURRENT_DATE) " +
            "GROUP BY MONTH(p.created_at) " +
            "ORDER BY MONTH(p.created_at)", nativeQuery = true)
    List<Object[]> findMonthlyStatisticsForCurrentYear();

    List<Product> findProductsBySubCategory(CategorySub categorySub);

    @Query("SELECT p FROM Product p WHERE p.subCategory.parent.id = :categoryId")
    List<Product> findByCategoryId(@Param("categoryId") int categoryId);

    @Query(value = "SELECT DISTINCT size, color FROM datn.product_variant WHERE product_id = :productId AND deleted = false", nativeQuery = true)
    List<Object[]> getSizesAndColorsByProductId(@Param("productId") Long productId);




//    @Query(value = "SELECT * FROM datn.product WHERE DATE(sale_at) = CURDATE() ORDER BY sold_quantity DESC LIMIT 3", nativeQuery = true)
//    List<Product> findTopSalesByDay();
//
//    @Query(value = "SELECT * FROM datn.product WHERE WEEK(sale_at) = WEEK(CURDATE()) AND YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity DESC LIMIT 3", nativeQuery = true)
//    List<Product> findTopSalesByWeek();
//
//    @Query(value = "SELECT * FROM datn.product WHERE MONTH(sale_at) = MONTH(CURDATE()) AND YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity DESC LIMIT 3", nativeQuery = true)
//    List<Product> findTopSalesByMonth();
//
//    @Query(value = "SELECT * FROM datn.product WHERE YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity DESC LIMIT 3", nativeQuery = true)
//    List<Product> findTopSalesByYear();
//
//    @Query(value = "SELECT * FROM datn.product WHERE DATE(sale_at) = CURDATE() ORDER BY sold_quantity ASC LIMIT 3", nativeQuery = true)
//    List<Product> findLeastSalesByDay();
//
//    @Query(value = "SELECT * FROM datn.product WHERE WEEK(sale_at) = WEEK(CURDATE()) AND YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity ASC LIMIT 3", nativeQuery = true)
//    List<Product> findLeastSalesByWeek();
//
//    @Query(value = "SELECT * FROM datn.product WHERE MONTH(sale_at) = MONTH(CURDATE()) AND YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity ASC LIMIT 3", nativeQuery = true)
//    List<Product> findLeastSalesByMonth();
//
//    @Query(value = "SELECT * FROM datn.product WHERE YEAR(sale_at) = YEAR(CURDATE()) ORDER BY sold_quantity ASC LIMIT 3", nativeQuery = true)
//    List<Product> findLeastSalesByYear();


    // Lọc theo BÁN CHẠY (sắp xếp theo soldQuantity giảm dần)
    List<Product> findByDeletedFalseOrderBySoldQuantityDesc();

    // Lọc theo MỚI NHẤT (sắp xếp theo createdAt giảm dần)
    List<Product> findByDeletedFalseOrderByCreatedAtDesc();

    // Lọc theo GIÁ
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.price BETWEEN :min AND :max")
    List<Product> findByPriceRange(@Param("min") double min, @Param("max") double max);

    // Lọc theo GIÁ từ min trở lên
    @Query("SELECT p FROM Product p WHERE p.deleted = false AND p.price >= :min")
    List<Product> findByPriceGreaterThanEqual(@Param("min") double min);

    // Lọc theo ĐÁNH GIÁ (sao)
    @Query("SELECT p FROM Product p " +
            "WHERE p.deleted = false AND EXISTS (" +
            "SELECT r FROM ProductReview r WHERE r.product = p AND r.deleted = false " +
            "GROUP BY r.product HAVING AVG(r.rating) >= :minRating)")
    List<Product> findByAverageRatingGreaterThanEqual(@Param("minRating") double minRating);

    @Query("SELECT p FROM Product p " +
            "WHERE p.deleted = false " +
            "AND p.price <= :maxPrice " +
            "AND p.id IN (" +
            "   SELECT r.product.id FROM ProductReview r " +
            "   WHERE r.deleted = false " +
            "   GROUP BY r.product.id " +
            "   HAVING AVG(r.rating) >= :minRating)")
    List<Product> findByPriceLessThanEqualAndAvgRatingGreaterThanEqual(
            @Param("maxPrice") double maxPrice,
            @Param("minRating") double minRating);


}
