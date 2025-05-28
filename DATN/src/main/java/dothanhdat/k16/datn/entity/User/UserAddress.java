package dothanhdat.k16.datn.entity.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Order.OrderItem;
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
public class UserAddress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String province;
    String district;
    String ward;
    String street;

//    Double latitude;
//    Double longitude;

    @Transient
    String address = this.province +", "+ this.district +", "+ this.ward +", "+ this.street;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted = false;

    @PostLoad
    @PostPersist
    @PostUpdate
    private void updateAddress() {
        this.address = String.join(", ",
                this.province != null ? this.province : "",
                this.district != null ? this.district : "",
                this.ward != null ? this.ward : "",
                this.street != null ? this.street : "");
    }

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-address")
    User user;

    @OneToMany(mappedBy = "userAddress" )
    @JsonManagedReference("address-order")
    List<Order> orders;

    public UserAddress(int id,String address) {
        this.id = id;
        this.address = address;
    }
}
