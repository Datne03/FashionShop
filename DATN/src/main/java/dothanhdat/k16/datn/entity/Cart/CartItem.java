package dothanhdat.k16.datn.entity.Cart;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CartItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    int quantity;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    @JsonBackReference("cart-item")
    Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    @JsonBackReference("cart-variant")
    ProductVariant productVariant;
}
