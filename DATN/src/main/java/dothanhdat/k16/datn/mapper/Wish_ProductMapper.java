package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.Wish_ProductResponse;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface Wish_ProductMapper {
    @Mapping(source = "wish", target = "wish")
    @Mapping(source = "product", target = "product")
    Wish_ProductResponse toWishProductResponse(Wish_Product wish_product);
}
