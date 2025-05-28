package dothanhdat.k16.datn.entity.Receipt;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Receipt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String supplierName;

    LocalDateTime createdAt;

    String note;

    @OneToMany(mappedBy = "receipt", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference("receipt-items")
    List<ReceiptItem> receiptItems;
}
