package dothanhdat.k16.datn.dto.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class OrderItemUpdate {
    private int orderItemId;
    private int quantity;
}