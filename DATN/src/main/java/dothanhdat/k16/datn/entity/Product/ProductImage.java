package dothanhdat.k16.datn.entity.Product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductImage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String imageUrl;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("product-image")
    Product product;

    public ProductImage(String imageUrl, Product product) {
        this.imageUrl = imageUrl;
        this.product = product;
    }
}
