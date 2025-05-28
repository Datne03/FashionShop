package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.OrderItemResponse;
import dothanhdat.k16.datn.entity.Order.OrderItem;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IOrderItemMapper {
    @Mapping(target = "productVariant", source = "productVariant")
    @Mapping(target = "order", source = "order")
    OrderItemResponse toOrderItemResponse(OrderItem orderItem);



//    @Named("mapProductImagesToFirstImageUrl")
//    default String mapProductImagesToFirstImageUrl(List<ProductImage> productImages) {
//        if (productImages != null && !productImages.isEmpty()) {
//            return productImages.get(0).getImageUrl();
//        }
//        return null;
//    }

    @Named("mapProductImagesToImageUrlList")
    default List<String> mapProductImagesToImageUrlList(List<ProductImage> productImages) {
        if (productImages == null || productImages.isEmpty()) {
            return List.of();
        }
        return productImages.stream()
                .map(ProductImage::getImageUrl)
                .collect(Collectors.toList());
    }
}
