package dothanhdat.k16.datn.entity.Product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReview {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String review;
    int rating;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    String imageUrl;
    boolean deleted = false;

    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonBackReference("product-review")
    Product product;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-review")
    User user;
}
