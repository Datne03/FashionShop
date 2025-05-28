package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.WishResponse;
import dothanhdat.k16.datn.dto.response.Wish_ProductResponse;
import dothanhdat.k16.datn.entity.Cart.Wish;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.Product.ProductImage;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

import java.util.List;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface IWishMapper {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "wishList", target = "wishList", qualifiedByName = "mapWish")
    WishResponse toWishResponse(Wish wish);

    @Named("mapWish")
    @Mapping(source = "wish", target = "wish")
    @Mapping(source = "product", target = "product")
    Wish_ProductResponse toWishProductResponse(Wish_Product wish_product);

//    @Named("mapPro")
//    @Mapping(source = "wish.id", target = "wish_id")
//    @Mapping(source = "product.id", target = "product_id")
//    Wish_ProductResponse toWishProductResponse(Wish_Product wish_product);
}
