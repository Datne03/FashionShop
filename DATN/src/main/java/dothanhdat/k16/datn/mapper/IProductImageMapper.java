package dothanhdat.k16.datn.mapper;


import dothanhdat.k16.datn.dto.response.ProductImageResponse;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

import java.util.List;

@Mapper(componentModel = "spring")
public interface IProductImageMapper {
    @Mapping(source = "product", target = "product")
    ProductImageResponse toProductImageResponse(ProductImage productImage);
    List<ProductImageResponse> toProductImageResponseList(List<ProductImage> productImageList);
}
