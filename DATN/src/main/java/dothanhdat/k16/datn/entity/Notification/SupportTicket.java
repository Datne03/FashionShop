package dothanhdat.k16.datn.entity.Notification;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import dothanhdat.k16.datn.entity.Order.Order;
import dothanhdat.k16.datn.entity.User.User;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class SupportTicket {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    int id;

    String issue;
    String adminReply;
    LocalDateTime createdAt;
    LocalDateTime repliedAt;
    boolean deleted = false;

    @Enumerated(EnumType.STRING)
    TicketStatus status;

    @ManyToOne
    @JoinColumn(name = "user_id")
    @JsonBackReference("support-user")
    User user;

    @OneToOne
    @JoinColumn(name = "order_id")
    @JsonBackReference("order-support")
    Order order;
}
