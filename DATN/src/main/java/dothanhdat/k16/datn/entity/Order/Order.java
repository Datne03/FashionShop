package dothanhdat.k16.datn.entity.Order;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "orders")
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    String note;
    double totalPrice;
    double shippingFee;

    LocalDateTime createdAt;
    LocalDateTime updatedAt;

    @Enumerated(EnumType.STRING)
    OrderStatus status;

    @Enumerated(EnumType.STRING)
    PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    PaymentStatus paymentStatus;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("user-order")
    User user;

    @ManyToOne
    @JoinColumn(name = "user_address_id")
    @JsonBackReference("address-order")
    UserAddress userAddress;

    @OneToMany(mappedBy = "order")
    @JsonManagedReference("order-item")
    List<OrderItem> orderItems = new ArrayList<>();

    @ManyToOne
    @JoinColumn(name = "user_voucher_id")
    @JsonBackReference("voucher-order")
    UserVoucher userVoucher;

    @OneToOne(mappedBy = "order")
    @JsonManagedReference("order-support")
    SupportTicket supportTicket;


}
