package dothanhdat.k16.datn.mapper;

import dothanhdat.k16.datn.dto.response.CartItemResponse;
import dothanhdat.k16.datn.dto.response.CartResponse;
import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Cart.CartItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;

@Mapper(componentModel = "spring")
public interface ICartMapper {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "cartItems", target = "cartItems", qualifiedByName = "mapCart")
    CartResponse toCartResponse(Cart cart);

    @Named("mapCart")
    @Mapping(target = "productVariant", source = "productVariant")
    @Mapping(target = "cart", source = "cart")
    CartItemResponse toCartItemResponse(CartItem cartItem);
}
