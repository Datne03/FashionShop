package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItemResponse {
    int id;
    int quantity;
    Cart cart;
    ProductVariantResponse productVariant;
}
