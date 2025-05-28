package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItemResponse {
    int id;
    int quantity;
    BigDecimal price;
    Order order;
    ProductVariantResponse productVariant;
}
