package dothanhdat.k16.datn.entity.Category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class CategoryVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String code;
    double discount;
    String description;

    LocalDateTime startDate;
    LocalDateTime endDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted = false;

    @OneToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference("cate-voucher")
    Category category;

}
