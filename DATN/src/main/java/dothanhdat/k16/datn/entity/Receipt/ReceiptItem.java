package dothanhdat.k16.datn.entity.Receipt;

import com.fasterxml.jackson.annotation.JsonBackReference;
import dothanhdat.k16.datn.entity.Product.ProductVariant;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class ReceiptItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    int quantity;

    double price;

    @ManyToOne
    @JoinColumn(name = "receipt_id")
    @JsonBackReference("receipt-items")
    Receipt receipt;

    @ManyToOne
    @JoinColumn(name = "product_variant_id")
    ProductVariant productVariant;
}
