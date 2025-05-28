package dothanhdat.k16.datn.dto.request;

import dothanhdat.k16.datn.entity.Product.ProductVariant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductCreateDTO {
    ProductCreateRequest product;
    List<ProductVariant> variants;
    Integer subCategoryId;
    Integer supplierId;
}
