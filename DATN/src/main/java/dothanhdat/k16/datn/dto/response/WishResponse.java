package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class WishResponse {
    int id;
    User user;
    List<Wish_ProductResponse> wishList;
}
