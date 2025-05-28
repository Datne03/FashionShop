package dothanhdat.k16.datn.entity.Cart;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Product.Product;
import dothanhdat.k16.datn.entity.User.User;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class Wish {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-wish")
    User user;

    @OneToMany(mappedBy = "wish")
    @JsonManagedReference("wishList_wish")
    List<Wish_Product> wishList;
}
