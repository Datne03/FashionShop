package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.CartItemResponse;
import dothanhdat.k16.datn.entity.Cart.CartItem;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface ICartItemMapper {
    @Mapping(target = "productVariant", source = "productVariant")
    @Mapping(target = "cart", source = "cart")
    CartItemResponse toCartItemResponse(CartItem cartItem);

    @Named("mapImages")
    static List<String> mapImages(List<ProductImage> productImages) {
        return productImages != null ?
                productImages.stream().map(ProductImage::getImageUrl).collect(Collectors.toList()) :
                null;
    }

    List<CartItemResponse> toCartItemResponseList(List<CartItem> cartItemList);
}
