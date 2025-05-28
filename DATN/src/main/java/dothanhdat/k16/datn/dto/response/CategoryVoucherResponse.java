package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Category.Category;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryVoucherResponse {
    int id;
    String code;
    double discount;
    String description;
    LocalDateTime startDate;
    LocalDateTime endDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted;
    Category category;

}
