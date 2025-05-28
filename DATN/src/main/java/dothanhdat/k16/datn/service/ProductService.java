package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.*;
import dothanhdat.k16.datn.dto.response.ProductResponse;
import dothanhdat.k16.datn.entity.Product.Product;

import java.util.List;

public interface ProductService {
    ProductResponse createProduct(ProductCreateDTO productCreateDTO);
    ProductResponse updateProduct(int id, ProductUpdateRequest request);
    String deleteProduct(int id);
    List<ProductResponse> getProductsBySubCategoryForUser(int categorySubId);
    List<ProductResponse> getProductsBySubCategoryForAdmin(int categorySubId);
    List<ProductResponse> getAllProductsByCategoryForUser(int categoryId);
    List<ProductResponse> getAllProductsByCategoryForAdmin(int categoryId);
    List<ProductResponse> getAllProduct();

    ProductResponse getProductById(int id);

    List<Product> getBestSellingProducts();
    List<Product> getNewestProducts();
    List<Product> getProductsByPriceRange(Double min, Double max);
    List<Product> getProductsByRating(Integer minRating);
    List<Product> filterByPriceAndRating(double maxPrice, double minRating);


}
