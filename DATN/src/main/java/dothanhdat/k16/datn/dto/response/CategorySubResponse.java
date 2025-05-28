package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategoryVoucher;
import dothanhdat.k16.datn.entity.Product.Product;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategorySubResponse {
    int id;
    String name;
    String description;
    String image;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted;

    Category parent;
    List<ProductResponse> products;
}
