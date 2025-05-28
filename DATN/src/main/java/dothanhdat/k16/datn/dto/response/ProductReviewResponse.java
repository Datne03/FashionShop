package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.User.User;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.Instant;
import java.time.LocalDateTime;


@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewResponse {
    int id;
    int rating;
    String review;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    String imageUrl;
    boolean deleted;
    Product product;;
    User user;
}
