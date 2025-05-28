package dothanhdat.k16.datn.dto.request;

import dothanhdat.k16.datn.entity.User.UserAddress;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderUpdateRequest {
    private List<OrderItemUpdate> orderItems;
}

