package dothanhdat.k16.datn.dto.request;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ProductReviewCreateRequest {

    String review;
    int rating;
}
