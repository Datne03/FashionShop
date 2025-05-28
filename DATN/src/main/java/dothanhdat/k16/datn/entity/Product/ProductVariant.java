package dothanhdat.k16.datn.entity.Product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Cart.CartItem;
import dothanhdat.k16.datn.entity.Order.OrderItem;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String size;
    String color;
    int stock;
    boolean deleted;

    @OneToMany(mappedBy = "productVariant" )
    @JsonManagedReference("cart-variant")
    List<CartItem> cartItems;

    @OneToMany(mappedBy = "productVariant" )
    @JsonManagedReference("order-variant")
    List<OrderItem> orderItems;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("product-variant")
    Product product;
}
