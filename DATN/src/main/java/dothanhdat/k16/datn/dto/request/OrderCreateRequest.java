package dothanhdat.k16.datn.dto.request;

import dothanhdat.k16.datn.entity.Order.OrderItem;
import dothanhdat.k16.datn.entity.Order.PaymentMethod;
import dothanhdat.k16.datn.entity.User.UserAddress;
import lombok.*;
import lombok.experimental.FieldDefaults;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE)
public class OrderCreateRequest {
    PaymentMethod paymentMethod;
    String note;
    String voucher;
    UserAddress userAddress;
    List<OrderItemCreate> orderItems;
}
