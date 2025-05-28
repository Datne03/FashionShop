package dothanhdat.k16.datn.entity.User;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Order.Order;
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
@Table(name = "user_voucher")
public class UserVoucher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String code;
    double discount;
    String description;
    int useAmount;

    LocalDateTime startDate;
    LocalDateTime endDate;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean deleted = false;

    @OneToMany(mappedBy = "userVoucher" )
    @JsonManagedReference("voucher-userVoucher")
    List<User_UserVoucher> userUserVouchers;

    @OneToMany(mappedBy = "userVoucher" )
    @JsonManagedReference("voucher-order")
    List<Order> orders = new ArrayList<>();

}
