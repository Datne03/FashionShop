package dothanhdat.k16.datn.entity.Product;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Cart.Wish;
import dothanhdat.k16.datn.entity.Cart.Wish_Product;
import dothanhdat.k16.datn.entity.Category.Category;
import dothanhdat.k16.datn.entity.Category.CategorySub;
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
//@Inheritance(strategy = InheritanceType.JOINED) // Table Per Type (TPT) => abstract
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    double price;
    String material;
    String description;
    double priceDiscount;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    boolean deleted = false;
    int soldQuantity;

    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("product-variant")
    List<ProductVariant> variants = new ArrayList<>();

    @OneToMany(mappedBy = "product" )
    @JsonManagedReference("product-image")
    List<ProductImage> productImages;

    @OneToMany(mappedBy = "product" )
    @JsonManagedReference("product-review")
    List<ProductReview> productReviews;

    @OneToMany(mappedBy = "product" )
    @JsonManagedReference("wishList_product")
    List<Wish_Product> wishProducts;

    @ManyToOne
    @JoinColumn(name = "category_sub_id")
    @JsonBackReference("subCate-product")
    CategorySub subCategory;

    @ManyToOne
    @JoinColumn(name = "supplier_id")
    @JsonBackReference("supplier-product")
    Supplier supplier;
}
