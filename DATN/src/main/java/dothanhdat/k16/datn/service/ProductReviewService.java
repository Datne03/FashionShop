package dothanhdat.k16.datn.service;

import dothanhdat.k16.datn.dto.request.ProductReviewCreateRequest;
import dothanhdat.k16.datn.dto.request.ProductReviewUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductReviewResponse;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface ProductReviewService {
    ProductReviewResponse createProductReview(int userId, int productId, ProductReviewCreateRequest request);
    ProductReviewResponse updateProductReview(int id, ProductReviewUpdateRequest request);
    String deleteProductReview(int id);
    List<ProductReviewResponse> getReviewsByProductId(int productId);
    List<ProductReviewResponse> getReviewsByUserId(int userId);
    Optional<ProductReviewResponse> getReviewById(int id);
    int getReviewsCountByProductId(int productId);
    double getAverageRatingByProductId(int productId);
}
