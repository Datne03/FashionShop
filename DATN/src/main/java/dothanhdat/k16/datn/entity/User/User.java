package dothanhdat.k16.datn.entity.User;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Cart.Cart;
import dothanhdat.k16.datn.entity.Notification.Message;
import dothanhdat.k16.datn.entity.Notification.Notification;
import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.Product.ProductReview;
import dothanhdat.k16.datn.entity.Cart.Wish;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;

@Entity
@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;
    @Column(nullable = false, unique = true)
    String username;
    String password;
    @Column(nullable = false, unique = true)
    String email;
    String phone;
    String avatar;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    boolean active = true;

    @ElementCollection
    Set<String> roles;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-address")
    List<UserAddress> userAddresses;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-voucher")
    private List<User_UserVoucher> userUserVouchers;

    @OneToMany(mappedBy = "sender")
    @JsonManagedReference(value = "sent-messages")
    List<Message> sentMessages;

    @OneToMany(mappedBy = "receiver")
    @JsonManagedReference(value = "received-messages")
    List<Message> receivedMessages;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-cart")
    List<Cart> cart;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-review")
    List<ProductReview> review;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-order")
    List<Order> orders;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("user-wish")
    List<Wish> wishes;

    @OneToMany(mappedBy = "user" )
    @JsonManagedReference("notification-user")
    List<Notification> notifications;

    @OneToMany(mappedBy = "user")
    @JsonManagedReference("support-user")
    List<SupportTicket> supportTickets;
}
