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
public class CategorySub {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String description;
    String image;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted = false;

//    @Enumerated(EnumType.STRING)
//    ProductVariantType variantType;
//
    @ManyToOne
    @JoinColumn(name = "category_id")
    @JsonBackReference("cateSub-cate")
    Category parent;

    @OneToMany(mappedBy = "subCategory")
    @JsonManagedReference("subCate-product")
    List<Product> products = new ArrayList<>();
}
