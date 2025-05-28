package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Product.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantResponse {
    int id;
    String size;
    String color;
    int stock;
    boolean deleted;
    Product product;
}
