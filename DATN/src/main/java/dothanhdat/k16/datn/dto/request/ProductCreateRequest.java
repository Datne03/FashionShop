package dothanhdat.k16.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreateRequest {
    String name;
    double price;
    String material;
    String description;

    //List<ProductVariantCreateRequest> variants;

}
