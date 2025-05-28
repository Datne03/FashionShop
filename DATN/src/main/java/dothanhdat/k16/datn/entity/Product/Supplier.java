package dothanhdat.k16.datn.entity.Product;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Supplier {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String name;
    String address;
    String phone;
    String email;
    boolean deleted = false;

    @OneToMany(mappedBy = "supplier" )
    @JsonManagedReference("supplier-product")
    List<Product> products = new ArrayList<>();
}
