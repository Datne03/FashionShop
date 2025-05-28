package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Cart.CartItem;
import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartResponse {
    int id;
    double totalPrice;
    UserResponse user;
    List<CartItemResponse> cartItems;
}
