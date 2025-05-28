package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Cart.Wish;
import dothanhdat.k16.datn.entity.Product.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Wish_ProductResponse {
    int id;
    Wish wish;
    ProductResponse product;
}
