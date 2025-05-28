package dothanhdat.k16.datn.entity.Order;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    int quantity;
    BigDecimal price;

    @ManyToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference("order-item")
    Order order;

    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    @JsonBackReference("order-variant")
    ProductVariant productVariant;
}
