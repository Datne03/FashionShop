package dothanhdat.k16.datn.dto.response;

import dothanhdat.k16.datn.entity.Notification.SupportTicket;
import dothanhdat.k16.datn.entity.Order.*;
import dothanhdat.k16.datn.entity.User.User;
import dothanhdat.k16.datn.entity.User.UserAddress;
import dothanhdat.k16.datn.entity.User.UserVoucher;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderResponse {
    int id;
    double totalPrice;
    String note;
    double shippingFee;
    LocalDateTime createdAt;
    LocalDateTime updatedAt;
    OrderStatus status;
    PaymentMethod paymentMethod;
    PaymentStatus paymentStatus;
    User user;
    UserAddress userAddress;
    UserVoucher userVoucher;
    SupportTicket supportTicket;
    List<OrderItemResponse> orderItems;
}
