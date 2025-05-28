package dothanhdat.k16.datn.entity.Category;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Product.Product;
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
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String description;
    String image;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted = false;

    @OneToMany(mappedBy = "parent")
    @JsonManagedReference("cateSub-cate")
    List<CategorySub> subCategories = new ArrayList<>();

    @OneToOne(mappedBy = "category")
    @JsonManagedReference("cate-voucher")
    CategoryVoucher categoryVoucher;

}
