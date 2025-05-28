package dothanhdat.k16.datn.dto.request;

import lombok.*;
import lombok.experimental.FieldDefaults;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariantUpdateRequest {
    String size;
    String color;
    int stock;
}
