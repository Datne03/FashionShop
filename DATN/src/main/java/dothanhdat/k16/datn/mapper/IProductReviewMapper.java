package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.request.ProductReviewCreateRequest;
import dothanhdat.k16.datn.dto.request.ProductReviewUpdateRequest;
import dothanhdat.k16.datn.dto.response.ProductReviewResponse;
import dothanhdat.k16.datn.entity.Product.ProductReview;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.factory.Mappers;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IProductReviewMapper {

    @Mapping(source = "product", target = "product")
    @Mapping(source = "user", target = "user")
    ProductReviewResponse toProductReviewResponse(ProductReview productReview);

    ProductReview toProductReview(ProductReviewCreateRequest request);

    List<ProductReviewResponse> toProductReviewResponseList(List<ProductReview> productReviews);

    void updateProductReview(@MappingTarget ProductReview productReview, ProductReviewUpdateRequest request);
}
