package dothanhdat.k16.datn.entity.Cart;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.Product.Product;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Wish_Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne
    @JoinColumn(name = "wish_id")
    @JsonBackReference("wishList_wish")
    Wish wish;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("wishList_product")
    Product product;
}
