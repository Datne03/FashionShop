package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.Category.CategorySub;
import dothanhdat.k16.datn.entity.Product.ProductReview;
import dothanhdat.k16.datn.entity.Product.Supplier;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductResponse {
    int id;
    String name;
    double price;
    String material;
    String description;
    double priceDiscount;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted;
    int soldQuantity;
    CategorySub subCategory;
    List<ProductImageResponse> productImages;
    List<ProductVariantResponse> variants;
    Supplier supplier;
}